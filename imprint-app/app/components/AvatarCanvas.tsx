'use client';
import { useEffect, useRef } from 'react';
import { AvatarParticles } from '@/lib/avatar-particles';
import { useSessionStore } from '@/lib/session-store';

export default function AvatarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AvatarParticles | null>(null);
  const { micState, audioLevel } = useSessionStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = new AvatarParticles(canvas);
    particlesRef.current.start();

    return () => {
      window.removeEventListener('resize', resize);
      particlesRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    particlesRef.current?.setMicState(micState);
  }, [micState]);

  useEffect(() => {
    particlesRef.current?.setAudioLevel(audioLevel);
  }, [audioLevel]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
