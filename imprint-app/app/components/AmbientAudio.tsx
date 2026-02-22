'use client';
import { useEffect, useRef } from 'react';
import { useSessionStore } from '@/lib/session-store';

// Volume targets per state
const VOL_IDLE     = 0.20;  // audible ambient on home screen
const VOL_ACTIVE   = 0.08;  // subtle during session
const VOL_SPEAKING = 0.03;  // near-silent when agent is talking
const VOL_OFF      = 0;

function fadeTo(audio: HTMLAudioElement, target: number, stepMs = 60): () => void {
  const step = target > audio.volume ? 0.012 : -0.015;
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
  const unlockedRef = useRef(false);
  const { state, audioEnabled, micState } = useSessionStore();

  // Unlock audio on first user interaction (browser autoplay policy)
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().then(() => {
        unlockedRef.current = true;
        if (!audioEnabled) audio.pause();
      }).catch(() => {});
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, [audioEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioEnabled) {
      return fadeTo(audio, VOL_OFF);
    }

    if (state === 'idle') {
      if (unlockedRef.current) audio.play().catch(() => {});
      return fadeTo(audio, VOL_IDLE);
    }

    if (state === 'active') {
      if (unlockedRef.current) audio.play().catch(() => {});
      const target = micState === 'AI_SPEAKING' ? VOL_SPEAKING : VOL_ACTIVE;
      return fadeTo(audio, target);
    }

    // complete — fade out
    return fadeTo(audio, VOL_OFF);
  }, [state, audioEnabled, micState]);

  return <audio ref={audioRef} src="/audio/ambient.mp3" loop preload="auto" />;
}
