'use client';
import { useEffect, useRef, useCallback } from 'react';
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
  guide: coachPrompt,   // sidebar uses id='guide', prompt is coachPrompt
};

export default function HomePage() {
  const router = useRouter();
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
    audioEnabled,
    toggleAudio,
    audioLevel,
    setAudioLevel,
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
        setAudioLevel(avg / 128); // normalise to 0–1
        levelAnimRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      // Non-fatal — level monitor failed but session can continue
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
        const transcript = event.results[event.results.length - 1][0].transcript;
        messages.push({ role: 'user', content: transcript });
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
            const updates = parseSectionUpdates(data.content);
            updates.forEach((u) =>
              addSection(u.section, { title: u.title, content: u.content })
            );
            setMicState('AI_SPEAKING');
            const utterance = new SpeechSynthesisUtterance(
              data.content
                .replace(/<section_update>[\s\S]*?<\/section_update>/g, '')
                .trim()
            );
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
        if (e.error === 'no-speech') return;   // non-fatal — keep listening
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
        setMicState('LISTENING'); // other errors: stay ready
      };

      recognition.start();
      conversationRef.current = { _recognition: recognition };
    },
    [addSection, setMicState, setMicError]
  );

  // ── Start session ─────────────────────────────────────────────────────────
  const handleStartSession = useCallback(async () => {
    setMicError(null);

    // Step 1: Request mic permission and start level monitor
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

    // Step 2: Start session
    sessionActiveRef.current = true;
    setState('active');
    setMicState('READY');
    startTimer();

    const prompt = AGENT_PROMPTS[selectedAgent] || strategistPrompt;

    try {
      const conversation = await startConversation({
        agentKey: selectedAgent,
        systemPrompt: prompt,
        onMessage: (msg) => {
          if (msg.source === 'ai') {
            const updates = parseSectionUpdates(msg.message);
            updates.forEach((u) =>
              addSection(u.section, { title: u.title, content: u.content })
            );
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
            if (elapsed >= 5) {
              sessionActiveRef.current = false;
              stopLevelMonitor();
              setState('complete');
              setMicState('READY');
            } else {
              // Premature disconnect — fall back to browser SpeechRecognition
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
    useBrowserFallback,
  ]);

  // ── End session ───────────────────────────────────────────────────────────
  const handleEndSession = useCallback(async () => {
    sessionActiveRef.current = false;
    stopTimer();
    stopLevelMonitor();
    const conv = conversationRef.current;
    if (conv?.endSession) {
      await conv.endSession();
    } else if (conv?._recognition) {
      conv._recognition.stop();
    }
    setState('complete');
    setMicState('READY');
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
            appState={state}
            micState={micState}
            micError={micError}
            audioLevel={audioLevel}
            audioEnabled={audioEnabled}
            onStartSession={handleStartSession}
            onToggleAudio={toggleAudio}
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
              elapsedSeconds={elapsedSeconds}
              onPause={handleEndSession}
              onEnd={handleEndSession}
              expectedSections={selectedModules.map((_, i) => `section-${i}`)}
            />
          )}
          {state === 'complete' && (
            <SessionComplete
              sections={sections}
              onNewSession={handleNewSession}
            />
          )}
        </div>
      </main>
    </div>
  );
}
