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
  coach: coachPrompt,
};

export default function HomePage() {
  const router = useRouter();
  const conversationRef = useRef<ConversationHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    state,
    setState,
    selectedAgent,
    selectedModules,
    micState,
    setMicState,
    elapsedSeconds,
    tick,
    sections,
    addSection,
    audioEnabled,
    toggleAudio,
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

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const useBrowserFallback = useCallback(
    (systemPrompt: string) => {
      if (typeof window === 'undefined') return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Win = window as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR: (new () => any) | undefined = Win.SpeechRecognition || Win.webkitSpeechRecognition;
      if (!SR) return;

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
        const state = useSessionStore.getState();
        if (state.appState === 'active') {
          try { recognition.start(); } catch { /* already started */ }
        }
      };

      recognition.onerror = (e: any) => {
        // 'no-speech' and 'audio-capture' are non-fatal — keep listening
        if (e.error === 'no-speech') return;
        if (e.error === 'audio-capture') return;
        setMicState('ERROR');
      };

      recognition.start();
      conversationRef.current = { _recognition: recognition };
    },
    [addSection, setMicState]
  );

  const handleStartSession = useCallback(async () => {
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
              // Normal session end
              setState('complete');
              setMicState('READY');
            } else {
              // Premature disconnect — ElevenLabs connection failed, try browser fallback
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
    startTimer,
    stopTimer,
    addSection,
    useBrowserFallback,
  ]);

  const handleEndSession = useCallback(async () => {
    stopTimer();
    const conv = conversationRef.current;
    if (conv?.endSession) {
      await conv.endSession();
    } else if (conv?._recognition) {
      conv._recognition.stop();
    }
    setState('complete');
    setMicState('READY');
  }, [setState, setMicState, stopTimer]);

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
