'use client';
import { useEffect, useRef } from 'react';
import { useSessionStore } from '@/lib/session-store';

// Volume targets per state
const VOL_IDLE    = 0.18;  // audible ambient on home screen
const VOL_ACTIVE  = 0.06;  // barely there during session
const VOL_SPEAKING = 0.02; // near-silent when agent is talking
const VOL_OFF     = 0;

function fadeTo(audio: HTMLAudioElement, target: number, stepMs = 60): () => void {
  const step = target > audio.volume ? 0.01 : -0.015;
  const id = setInterval(() => {
    const next = audio.volume + step;
    if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
      audio.volume = Math.max(0, Math.min(1, target));
      clearInterval(id);
    } else {
      audio.volume = Math.max(0, Math.min(1, next));
    }
  }, stepMs);
  return () => clearInterval(id);
}

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { state, audioEnabled, micState } = useSessionStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioEnabled) {
      return fadeTo(audio, VOL_OFF);
    }

    if (state === 'idle') {
      audio.play().catch(() => {});
      return fadeTo(audio, VOL_IDLE);
    }

    if (state === 'active') {
      audio.play().catch(() => {});
      const target = micState === 'AI_SPEAKING' ? VOL_SPEAKING : VOL_ACTIVE;
      return fadeTo(audio, target);
    }

    // complete or other — fade out
    return fadeTo(audio, VOL_OFF);
  }, [state, audioEnabled, micState]);

  return <audio ref={audioRef} src="/audio/ambient.mp3" loop preload="auto" />;
}
