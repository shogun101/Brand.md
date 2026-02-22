'use client';
import FloatingBar from './FloatingBar';
import MicIndicator from './MicIndicator';

type MicState = 'READY' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';
type AppState = 'idle' | 'active' | 'complete';

interface HeroPanelProps {
  agentName?: string;
  agentAvatar?: string;
  appState: AppState;
  micState: MicState;
  micError?: string | null;
  audioLevel?: number;
  audioEnabled: boolean;
  onStartSession?: () => void;
  onNewSession?: () => void;
  onToggleAudio?: () => void;
  /** Passed through to MicIndicator when session is active */
  isMuted?: boolean;
  onToggleMute?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

export default function HeroPanel({
  agentName = 'STRATEGIST',
  agentAvatar = '/images/hero-figure.png',
  appState,
  micState,
  micError,
  audioLevel = 0,
  audioEnabled,
  onStartSession,
  onNewSession,
  onToggleAudio,
  isMuted,
  onToggleMute,
  onPause,
  onEnd,
}: HeroPanelProps) {
  const haloColor =
    micState === 'LISTENING'
      ? 'rgba(70,167,88,0.08)'
      : micState === 'AI_SPEAKING'
      ? 'rgba(217,119,6,0.1)'
      : 'rgba(255,255,255,0.02)';

  const showComplete = appState === 'complete';

  return (
    <div className="relative h-full overflow-hidden border-r border-neutral-800 bg-brand-panel">
      {/* 1. Radial halo — z-1 */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${haloColor}, transparent 70%)`,
        }}
      />

      {/* 2. Agent avatar — z-2 */}
      <div className="absolute inset-0 z-[2]">
        <img
          key={agentAvatar}
          src={agentAvatar}
          alt="Agent avatar"
          className="absolute inset-0 h-full w-[103.7%] max-w-none object-cover animate-avatar-breathe"
          style={{ left: '-1.88%', top: '-0.05%' }}
        />
      </div>

      {/* Audio toggle — bottom-8 left-8 = 32px, consistent with system */}
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

      {/* UI overlays — z-20 */}
      {appState === 'idle' && (
        <FloatingBar agentName={agentName} onStartSession={onStartSession} />
      )}
      {appState === 'active' && (
        <MicIndicator
          micState={micState}
          micError={micError}
          audioLevel={audioLevel}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
          onPause={onPause}
          onEnd={onEnd}
        />
      )}
      {showComplete && (
        <FloatingBar isComplete onNewSession={onNewSession} />
      )}
    </div>
  );
}
