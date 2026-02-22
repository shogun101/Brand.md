'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/lib/session-store';
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
  const [isPaused, setIsPaused] = useState(false);
  const conversationRef = useRef<ConversationHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionActiveRef = useRef(false);

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
    setGenerating,
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

    let micStream: MediaStream | null = null;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      levelStreamRef.current = micStream;
      startLevelMonitor(micStream);
    } catch (err: unknown) {
      const name = (err as { name?: string })?.name ?? '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setMicState('ERROR');
        setMicError('Mic blocked — allow microphone access in browser settings');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setMicState('ERROR');
        setMicError('No microphone found — plug one in and try again');
      } else {
        setMicState('ERROR');
        setMicError('Could not access microphone');
      }
      setState('idle');
      return;
    }

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
        },
        // ── Plan B PRIMARY: parse sections from streaming tentative responses ──
        // ElevenLabs streams the LLM output via onDebug before finalizing.
        // The <section_update> blocks appear here even if stripped from agent_response.
        onDebug: (event) => {
          if (event?.type === 'tentative_agent_response' && typeof event.response === 'string') {
            console.log('[ElevenLabs tentative]', event.response.substring(0, 400));
            const updates = parseSectionUpdates(event.response);
            if (updates.length > 0) {
              console.log('[ElevenLabs tentative] sections found:', updates);
              updates.forEach((u) =>
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
          if (status === 'connecting') setMicState('READY');
          if (status === 'connected') setMicState('LISTENING');
          if (status === 'disconnected') {
            const elapsed = useSessionStore.getState().elapsedSeconds;
            stopTimer();
            if (elapsed >= 30) {
              sessionActiveRef.current = false;
              stopLevelMonitor();
              setState('complete');
              setMicState('READY');
            } else {
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
    const conv = conversationRef.current;
    if (conv?.endSession) {
      await conv.endSession();
    } else if (conv?._recognition) {
      conv._recognition.stop();
    }
    setMicState('READY');

    // ── Plan A: GPT-4o fallback ───────────────────────────────────────────
    // If no sections were captured during the live session (Plan B didn't fire)
    // but we have transcript content, auto-generate sections from GPT-4o.
    const storeState = useSessionStore.getState();
    const hasSections = Object.keys(storeState.sections).length > 0;
    const hasTranscript = storeState.transcript.length > 0;

    if (!hasSections && hasTranscript) {
      // Show SessionComplete immediately so user sees the panel (loading state)
      setState('complete');
      storeState.setGenerating(true);
      try {
        const res = await fetch('/api/generate-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: storeState.transcript.map((e) => ({
              source: e.role,
              message: e.text,
            })),
            moduleKey: storeState.selectedModules[0] || 'positioning',
            agentKey: storeState.selectedAgent,
            brandName: storeState.brandName,
          }),
        });
        const data: { sections?: Record<string, { title: string; content: string }> } =
          await res.json();
        if (data.sections) {
          console.log('[Plan A] GPT-4o generated sections:', Object.keys(data.sections));
          Object.entries(data.sections).forEach(([slug, section]) => {
            useSessionStore.getState().addSection(slug, section);
          });
        }
      } catch (e) {
        console.error('[Plan A] Section generation failed:', e);
      } finally {
        useSessionStore.getState().setGenerating(false);
      }
    } else {
      setState('complete');
    }
  }, [setState, setMicState, stopTimer, stopLevelMonitor]);

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
        className="absolute inset-x-0 bottom-0 flex"
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
            onToggleAudio={toggleAudio}
            onPause={handlePauseSession}
            onEnd={handleEndSession}
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
              onNewSession={handleNewSession}
            />
          )}
        </div>
      </main>
    </div>
  );
}
