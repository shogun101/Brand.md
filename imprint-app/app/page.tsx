'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useSessionStore } from '@/lib/session-store';
import { useCredits } from '@/lib/use-credits';
import { startConversation, parseSectionUpdates } from '@/lib/elevenlabs';
import { strategistPrompt } from '@/lib/prompts/strategist';
import { creativePrompt } from '@/lib/prompts/creative';
import { coachPrompt } from '@/lib/prompts/coach';
import Navbar from './components/Navbar';
import HeroPanel from './components/HeroPanel';
import Sidebar from './components/Sidebar';
import LiveDocument from './components/LiveDocument';
import SessionComplete from './components/SessionComplete';
import { AmbientAudio } from './components/AmbientAudio';
import AvatarCanvas from './components/AvatarCanvas';
import BuyCreditsModal from './components/BuyCreditsModal';

type ConversationHandle = {
  endSession?: () => Promise<void>;
  _recognition?: { stop: () => void };
};

const AGENT_PROMPTS: Record<string, string> = {
  strategist: strategistPrompt,
  creative: creativePrompt,
  guide: coachPrompt,
};

const AGENT_AVATARS: Record<string, string> = {
  strategist: '/images/hero-figure.png',
  creative: '/images/hero-creative.png',
  guide: '/images/hero-guide.png',
};

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { consumeCredit, addCredits, hydrate } = useCredits();
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const conversationRef = useRef<ConversationHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionActiveRef = useRef(false);
  // Forward ref so handleStartSession can call handleEndSession (declared later)
  const handleEndSessionRef = useRef<() => Promise<void>>(async () => {});

  // Audio level monitoring refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const levelStreamRef = useRef<MediaStream | null>(null);
  const levelAnimRef = useRef<number | null>(null);

  const {
    state,
    setState,
    selectedAgent,
    selectedModules,
    micState,
    setMicState,
    micError,
    setMicError,
    elapsedSeconds,
    tick,
    sections,
    addSection,
    transcript,
    addTranscript,
    audioEnabled,
    toggleAudio,
    audioLevel,
    setAudioLevel,
    isGenerating,
    isGeneratingKit,
    reset,
  } = useSessionStore();

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── Audio level monitor ────────────────────────────────────────────────────
  const startLevelMonitor = useCallback(async (stream: MediaStream) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AC = (window.AudioContext ?? (window as any).webkitAudioContext) as typeof AudioContext;
      const ctx = new AC();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      const loop = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(avg / 128);
        levelAnimRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      // Non-fatal
    }
  }, [setAudioLevel]);

  const stopLevelMonitor = useCallback(() => {
    if (levelAnimRef.current) {
      cancelAnimationFrame(levelAnimRef.current);
      levelAnimRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    if (levelStreamRef.current) {
      levelStreamRef.current.getTracks().forEach((t) => t.stop());
      levelStreamRef.current = null;
    }
    setAudioLevel(0);
  }, [setAudioLevel]);

  useEffect(() => {
    return () => {
      stopTimer();
      stopLevelMonitor();
    };
  }, [stopTimer, stopLevelMonitor]);

  // ── Hydrate credits from Supabase when signed in ──────────────────────────
  useEffect(() => {
    if (!isSignedIn) return;
    // Skip if we just came from a payment — addCredits handles it optimistically
    if (new URLSearchParams(window.location.search).get('credits_added')) return;
    fetch('/api/credits')
      .then(r => r.json())
      .then((data: { credits?: number; maxCredits?: number; isFreeTrial?: boolean }) => {
        if (data.credits !== undefined) {
          hydrate({ credits: data.credits, maxCredits: data.maxCredits ?? 1, isFreeTrial: data.isFreeTrial ?? true });
        }
      })
      .catch(() => {});
  }, [isSignedIn, hydrate]);

  // ── Handle ?credits_added= query param after purchase ────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const added = params.get('credits_added');
    if (added) {
      addCredits(Number(added));
      const url = new URL(window.location.href);
      url.searchParams.delete('credits_added');
      window.history.replaceState({}, '', url.toString());
    }
  }, [addCredits]);

  // ── Browser SpeechRecognition fallback ────────────────────────────────────
  const useBrowserFallback = useCallback(
    (systemPrompt: string) => {
      if (typeof window === 'undefined') return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Win = window as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR: (new () => any) | undefined = Win.SpeechRecognition || Win.webkitSpeechRecognition;
      if (!SR) {
        setMicState('ERROR');
        setMicError('Speech recognition not supported in this browser');
        return;
      }

      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      const messages: { role: string; content: string }[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = async (event: any) => {
        const spokenText = event.results[event.results.length - 1][0].transcript;
        messages.push({ role: 'user', content: spokenText });
        addTranscript('user', spokenText);
        setMicState('PROCESSING');

        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, systemPrompt }),
          });
          const data: { content?: string } = await res.json();

          if (data.content) {
            messages.push({ role: 'assistant', content: data.content });
            const cleanAi = data.content
              .replace(/<section_update>[\s\S]*?<\/section_update>/g, '')
              .trim();
            if (cleanAi) addTranscript('ai', cleanAi);
            const updates = parseSectionUpdates(data.content);
            updates.forEach((u) =>
              addSection(u.section, { title: u.title, content: u.content })
            );
            setMicState('AI_SPEAKING');
            const utterance = new SpeechSynthesisUtterance(cleanAi);
            utterance.onend = () => setMicState('LISTENING');
            window.speechSynthesis.speak(utterance);
          }
        } catch {
          setMicState('LISTENING');
        }
      };

      // Auto-restart on end — browser stops recognition after silence even with continuous:true
      recognition.onend = () => {
        if (sessionActiveRef.current) {
          try { recognition.start(); } catch { /* already starting */ }
        }
      };

      recognition.onerror = (e: { error: string }) => {
        if (e.error === 'no-speech') return;
        if (e.error === 'audio-capture') {
          setMicState('ERROR');
          setMicError('Mic not detected — check your microphone is connected');
          return;
        }
        if (e.error === 'not-allowed') {
          setMicState('ERROR');
          setMicError('Mic blocked — allow microphone access in browser settings');
          return;
        }
        setMicState('LISTENING');
      };

      recognition.start();
      conversationRef.current = { _recognition: recognition };
    },
    [addSection, addTranscript, setMicState, setMicError]
  );

  // ── Start session ─────────────────────────────────────────────────────────
  const handleStartSession = useCallback(async () => {
    setMicError(null);
    setIsStarting(true);

    let micStream: MediaStream | null = null;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      levelStreamRef.current = micStream;
      startLevelMonitor(micStream);
    } catch (err: unknown) {
      const name = (err as { name?: string })?.name ?? '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setMicError('Mic blocked — allow microphone access in browser settings');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setMicError('No microphone found — plug one in and try again');
      } else {
        setMicError('Could not access microphone');
      }
      setIsStarting(false);
      return;
    }

    setIsStarting(false);
    sessionActiveRef.current = true;
    setState('active');
    setMicState('READY');
    startTimer();

    const prompt = AGENT_PROMPTS[selectedAgent] || strategistPrompt;

    try {
      const conversation = await startConversation({
        agentKey: selectedAgent,
        moduleKey: selectedModules[0] || undefined,
        systemPrompt: prompt,
        onMessage: (msg) => {
          // ── Plan B: parse <section_update> blocks from final agent response ──
          // Note: ElevenLabs may or may not include these in agent_response
          // (tentative responses via onDebug are the primary parsing path).
          // We parse here too as a belt-and-suspenders measure.
          if (msg.source === 'ai') {
            console.log('[ElevenLabs onMessage raw]', msg.message.substring(0, 400));
            const updates = parseSectionUpdates(msg.message);
            if (updates.length > 0) {
              console.log('[ElevenLabs onMessage] sections found:', updates);
              updates.forEach((u) =>
                addSection(u.section, { title: u.title, content: u.content })
              );
            }
          }
          const cleanText = msg.message
            .replace(/<section_update>[\s\S]*?<\/section_update>/g, '')
            .trim();
          if (cleanText) {
            addTranscript(msg.source === 'ai' ? 'ai' : 'user', cleanText);
          }
          // ── Closing phrase detection — end session immediately ──
          // Agent says "ready in the sidebar" → don't wait for WebSocket to close naturally.
          if (msg.source === 'ai' && cleanText.toLowerCase().includes('ready in the sidebar')) {
            setTimeout(() => void handleEndSessionRef.current(), 3500);
          }
        },
        // ── Plan B PRIMARY: parse sections from streaming tentative responses ──
        // ElevenLabs streams the LLM output via onDebug before finalizing.
        // The <section_update> blocks appear here even if stripped from agent_response.
        onDebug: (debug) => {
          if (debug.type === 'tentative_agent_response') {
            const text = debug.response || debug.text || '';
            console.log('[tentative]', text.substring(0, 150));
            const updates = parseSectionUpdates(text);
            if (updates.length > 0) {
              console.log('[sections found]', updates.map((u: { section: string }) => u.section));
              updates.forEach((u: { section: string; title: string; content: string }) =>
                addSection(u.section, { title: u.title, content: u.content })
              );
            }
          }
        },
        onModeChange: ({ mode }) => {
          if (mode === 'listening') setMicState('LISTENING');
          if (mode === 'speaking') setMicState('AI_SPEAKING');
        },
        onStatusChange: ({ status }) => {
          console.log('[status change]', status);
          if (status === 'connecting') setMicState('READY');
          if (status === 'connected') setMicState('LISTENING');
          if (status === 'disconnected') {
            // Guard: if user already clicked End, state is 'complete' — don't double-fire
            const currentState = useSessionStore.getState().state;
            if (currentState !== 'active') return;
            const elapsed = useSessionStore.getState().elapsedSeconds;
            if (elapsed >= 30) {
              // Agent ended the session naturally — treat same as user clicking End
              void handleEndSessionRef.current();
            } else {
              stopTimer();
              setState('active');
              setMicState('LISTENING');
              useBrowserFallback(prompt);
            }
          }
        },
        onError: (_msg: string) => {
          setMicState('LISTENING');
          useBrowserFallback(prompt);
        },
      });
      conversationRef.current = conversation;
    } catch {
      setMicState('LISTENING');
      useBrowserFallback(prompt);
    }
  }, [
    selectedAgent,
    setState,
    setMicState,
    setMicError,
    startTimer,
    stopTimer,
    stopLevelMonitor,
    startLevelMonitor,
    addSection,
    addTranscript,
    useBrowserFallback,
  ]);

  // ── Pause session ─────────────────────────────────────────────────────────
  // Mutes mic input and stops SR auto-restart. ElevenLabs connection stays alive.
  // State remains 'active' — user can still End properly afterward.
  const handlePauseSession = useCallback(() => {
    sessionActiveRef.current = false;
    const conv = conversationRef.current;
    if (conv?._recognition) {
      conv._recognition.stop();
    }
    stopLevelMonitor();
    stopTimer();
    setMicState('READY');
    setIsPaused(true);
    // ElevenLabs conv intentionally NOT disconnected — session stays alive
  }, [stopLevelMonitor, stopTimer, setMicState]);

  // ── Toggle mute ───────────────────────────────────────────────────────────
  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      // Mute/unmute the mic track if available via getUserMedia stream
      if (levelStreamRef.current) {
        levelStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !next; });
      }
      return next;
    });
  }, []);

  // ── Resume session ────────────────────────────────────────────────────────
  const handleResumeSession = useCallback(() => {
    setIsPaused(false);
    sessionActiveRef.current = true;
    setMicState('LISTENING');
    startTimer();
  }, [setMicState, startTimer]);

  // ── End session ───────────────────────────────────────────────────────────
  const handleEndSession = useCallback(async () => {
    sessionActiveRef.current = false;
    stopTimer();
    stopLevelMonitor();
    setIsPaused(false);
    setIsMuted(false);
    const conv = conversationRef.current;
    if (conv?.endSession) {
      await conv.endSession();
    } else if (conv?._recognition) {
      conv._recognition.stop();
    }
    setMicState('READY');

    // ── Generate full brand kit via GPT-4o ────────────────────────────────
    // Always run kit generation when a session ends. Show SessionComplete
    // immediately in loading state, then fill in the kit when ready.
    const storeState = useSessionStore.getState();
    setState('complete');
    consumeCredit();
    storeState.setGeneratingKit(true);
    try {
      const res = await fetch('/api/generate-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: storeState.sections,
          transcript: storeState.transcript.map((e) => ({
            source: e.role,
            message: e.text,
          })),
          moduleKey: storeState.selectedModules[0] || 'positioning',
          agentKey: storeState.selectedAgent,
          brandName: storeState.brandName,
        }),
      });
      const data = await res.json();
      if (data.kit) {
        console.log('[kit] Generated successfully:', Object.keys(data.kit));
        storeState.setKitData(data.kit);
        // Auto-save session to Supabase if signed in
        if (isSignedIn) {
          fetch('/api/sessions/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brandName: storeState.brandName,
              module: storeState.selectedModules[0] || 'positioning',
              agent: storeState.selectedAgent,
              durationSeconds: storeState.elapsedSeconds,
              transcript: storeState.transcript,
              sections: storeState.sections,
              kitData: data.kit,
            }),
          }).catch(console.error); // fire and forget
        }
      }
    } catch (e) {
      console.error('[kit] Generation failed:', e);
    } finally {
      storeState.setGeneratingKit(false);
    }
  }, [setState, setMicState, stopTimer, stopLevelMonitor, isSignedIn]);
  // Keep the forward ref in sync so handleStartSession always calls the latest version
  handleEndSessionRef.current = handleEndSession;

  const handleNewSession = useCallback(() => {
    reset();
  }, [reset]);

  const agentDisplayName = selectedAgent.toUpperCase();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-brand-dark">
      <AmbientAudio />

      <Navbar
        onSessionsClick={() => router.push('/sessions')}
        onSettingsClick={() => {}}
      />

      <main
        className="absolute inset-x-0 bottom-0 hidden md:flex"
        style={{ top: '56px' }}
      >
        {/* Left — Hero panel */}
        <div className="relative min-w-0 flex-1">
          <HeroPanel
            agentName={agentDisplayName}
            agentAvatar={AGENT_AVATARS[selectedAgent] ?? '/images/hero-figure.png'}
            appState={state}
            micState={micState}
            micError={micError}
            audioLevel={audioLevel}
            audioEnabled={audioEnabled}
            onStartSession={handleStartSession}
            onNewSession={handleNewSession}
            onUpgrade={() => setBuyModalOpen(true)}
            onToggleAudio={toggleAudio}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={handlePauseSession}
            onEnd={handleEndSession}
            isSignedIn={isSignedIn ?? false}
            onSignIn={() => openSignIn()}
          />
          <AvatarCanvas />
        </div>

        {/* Right — Sidebar 448px */}
        <div className="relative w-[448px] shrink-0">
          {state === 'idle' && (
            <Sidebar
              onStartSession={handleStartSession}
              onAgentChange={() => {}}
              onModulesChange={() => {}}
              onUpgrade={() => setBuyModalOpen(true)}
              isSignedIn={isSignedIn ?? false}
              onSignIn={() => openSignIn()}
            />
          )}
          {state === 'active' && (
            <LiveDocument
              sections={sections}
              transcript={transcript}
              elapsedSeconds={elapsedSeconds}
              isPaused={isPaused}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
              onEnd={handleEndSession}
              expectedSections={selectedModules.map((_, i) => `section-${i}`)}
            />
          )}
          {state === 'complete' && (
            <SessionComplete
              sections={sections}
              isGenerating={isGenerating}
              isGeneratingKit={isGeneratingKit}
              onNewSession={handleNewSession}
            />
          )}
        </div>
      </main>

      {/* ── Mobile layout (< md) ── */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col md:hidden"
        style={{ top: '56px' }}
      >
        {/* Step 1: Configure — show Sidebar full-screen */}
        {state === 'idle' && (
          <div className="flex-1 min-h-0 relative w-full">
            <Sidebar
              onStartSession={handleStartSession}
              onAgentChange={() => {}}
              onModulesChange={() => {}}
              onUpgrade={() => setBuyModalOpen(true)}
              isSignedIn={isSignedIn ?? false}
              onSignIn={() => openSignIn()}
              isStarting={isStarting}
              micError={micError}
            />
          </div>
        )}

        {/* Step 2: Session live — show HeroPanel full-screen */}
        {state === 'active' && (
          <div className="relative w-full" style={{ height: 'calc(100dvh - 56px)' }}>
            <HeroPanel
              agentName={agentDisplayName}
              agentAvatar={AGENT_AVATARS[selectedAgent] ?? '/images/hero-figure.png'}
              appState={state}
              micState={micState}
              micError={micError}
              audioLevel={audioLevel}
              audioEnabled={audioEnabled}
              onStartSession={handleStartSession}
              onNewSession={handleNewSession}
              onToggleAudio={toggleAudio}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onPause={handlePauseSession}
              onEnd={handleEndSession}
              isSignedIn={isSignedIn ?? false}
              onSignIn={() => openSignIn()}
            />
            <AvatarCanvas />
          </div>
        )}

        {/* Step 3: Complete — show SessionComplete full-screen */}
        {state === 'complete' && (
          <div className="w-full" style={{ height: 'calc(100dvh - 56px)' }}>
            <SessionComplete
              sections={sections}
              isGenerating={isGenerating}
              isGeneratingKit={isGeneratingKit}
              onNewSession={handleNewSession}
            />
          </div>
        )}
      </div>

      {/* Buy Credits Modal — triggered from Sidebar/FloatingBar when credits=0 */}
      <BuyCreditsModal isOpen={buyModalOpen} onClose={() => setBuyModalOpen(false)} />
    </div>
  );
}
