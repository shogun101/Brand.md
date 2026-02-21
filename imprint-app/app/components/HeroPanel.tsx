'use client';
import FloatingBar from './FloatingBar';
import MicIndicator from './MicIndicator';

type MicState = 'READY' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';
type AppState = 'idle' | 'active' | 'complete';

interface HeroPanelProps {
  agentName?: string;
  appState: AppState;
  micState: MicState;
  audioEnabled: boolean;
  onStartSession?: () => void;
  onToggleAudio?: () => void;
}

export default function HeroPanel({
  agentName = 'STRATEGIST',
  appState,
  micState,
  audioEnabled,
  onStartSession,
  onToggleAudio,
}: HeroPanelProps) {
  // Radial halo color by state
  const haloColor =
    micState === 'LISTENING'
      ? 'rgba(70,167,88,0.08)'
      : micState === 'AI_SPEAKING'
      ? 'rgba(217,119,6,0.1)'
      : 'rgba(255,255,255,0.02)';

  // Glow overlay animation class by mic state
  const glowClass =
    appState === 'idle'
      ? 'animate-glow-idle'
      : micState === 'AI_SPEAKING'
      ? 'animate-glow-speaking'
      : 'animate-glow-active';

  const showComplete = appState === 'complete';

  return (
    <div className="relative h-full overflow-hidden border-r border-neutral-800 bg-brand-panel">
      {/* 1. Radial halo */}
      <div
        className="absolute inset-0 z-[1] transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${haloColor}, transparent 70%)`,
        }}
      />

      {/* 2. Figure image with breathing */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-figure.png"
          alt="AI Strategist figure"
          className="absolute inset-0 h-full w-[103.7%] max-w-none object-cover animate-avatar-breathe"
          style={{ left: '-1.88%', top: '-0.05%' }}
        />
        {/* Overlay removed — main figure renders clean */}
      </div>

      {/* Audio toggle */}
      <button
        onClick={onToggleAudio}
        className="absolute bottom-8 left-8 z-20 flex size-8 items-center justify-center rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.5)] text-neutral-200 backdrop-blur-sm transition-opacity hover:opacity-80"
        title={audioEnabled ? 'Mute ambient audio' : 'Enable ambient audio'}
      >
        {audioEnabled ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      {/* 5. Floating bar or Mic indicator or Complete pill */}
      {appState === 'idle' && (
        <FloatingBar agentName={agentName} onStartSession={onStartSession} />
      )}
      {appState === 'active' && <MicIndicator micState={micState} />}
      {showComplete && (
        <FloatingBar label="Session Complete ✓" />
      )}
    </div>
  );
}
