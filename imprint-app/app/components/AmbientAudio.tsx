'use client';
import { useEffect, useRef } from 'react';
import { useSessionStore } from '@/lib/session-store';

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { state, audioEnabled } = useSessionStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state === 'idle' && audioEnabled) {
      audio.volume = 0;
      audio.play().catch(() => {});
      const fade = setInterval(() => {
        if (audio.volume < 0.25) audio.volume = Math.min(audio.volume + 0.01, 0.25);
        else clearInterval(fade);
      }, 80);
      return () => clearInterval(fade);
    } else {
      const fade = setInterval(() => {
        if (audio.volume > 0.01) audio.volume = Math.max(audio.volume - 0.02, 0);
        else {
          audio.pause();
          clearInterval(fade);
        }
      }, 50);
      return () => clearInterval(fade);
    }
  }, [state, audioEnabled]);

  return <audio ref={audioRef} src="/audio/ambient-idle.mp3" loop preload="auto" />;
}
