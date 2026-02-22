'use client';
import { PauseIcon, XMarkIcon } from '@heroicons/react/24/solid';

type MicState = 'READY' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';

interface MicIndicatorProps {
  micState: MicState;
  audioLevel?: number;   // 0–1 real-time mic amplitude
  micError?: string | null;
  onPause?: () => void;
  onEnd?: () => void;
}

const stateConfig = {
  READY: {
    label: 'Ready',
    color: 'rgba(255,255,255,0.3)',
    showBars: true,
    live: false,
  },
  LISTENING: {
    label: 'Listening...',
    color: '#46a758',
    showBars: true,
    live: true,
  },
  PROCESSING: {
    label: 'Thinking...',
    color: '#d97706',
    showBars: false,
    live: false,
  },
  AI_SPEAKING: {
    label: 'Speaking...',
    color: 'rgba(255,255,255,0.16)',
    showBars: true,
    live: false,
  },
  ERROR: {
    label: 'Mic error',
    color: '#dc2626',
    showBars: false,
    live: false,
  },
};

// Fixed multipliers per bar so they look like a natural waveform
const BAR_MULTIPLIERS = [0.6, 1.0, 0.85, 0.5];
const BAR_MIN_H = 3;
const BAR_MAX_H = 18;

const animClasses = ['animate-bar-1', 'animate-bar-2', 'animate-bar-3', 'animate-bar-4'];

export default function MicIndicator({
  micState,
  audioLevel = 0,
  micError,
  onPause,
  onEnd,
}: MicIndicatorProps) {
  const config = stateConfig[micState];
  const textColor =
    config.color === 'rgba(255,255,255,0.3)' || config.color === 'rgba(255,255,255,0.16)'
      ? 'rgba(237,237,237,0.72)'
      : config.color;

  const boosted = Math.min(1, audioLevel * 2.5);

  const label = micState === 'ERROR'
    ? (micError ?? 'Mic error')
    : config.label;

  return (
    <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center">
      <div className="flex items-center rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.67)] shadow-[0px_10px_40px_0px_rgba(0,0,0,0.5)] backdrop-blur-[6px] overflow-hidden">

        {/* ── Left: mic state indicator ── */}
        <div className="flex items-center gap-3 py-2 pl-4 pr-4">

          {/* Bars (READY / LISTENING / AI_SPEAKING) */}
          {config.showBars && (
            <div className="flex h-5 items-center gap-[3px]">
              {[0, 1, 2, 3].map((i) => {
                if (config.live) {
                  const h = Math.max(BAR_MIN_H, Math.round(boosted * BAR_MAX_H * BAR_MULTIPLIERS[i]));
                  return (
                    <div
                      key={i}
                      className="w-[3px] rounded-[2px] transition-all duration-75"
                      style={{ height: `${h}px`, backgroundColor: config.color }}
                    />
                  );
                }
                return (
                  <div
                    key={i}
                    className={`w-[3px] rounded-[2px] ${animClasses[i]}`}
                    style={{ height: '8px', backgroundColor: config.color }}
                  />
                );
              })}
            </div>
          )}

          {/* Spinner dots (PROCESSING) */}
          {!config.showBars && micState !== 'ERROR' && (
            <div className="flex items-center gap-[6px]">
              <div className="size-2 rounded-full animate-dot-1" style={{ backgroundColor: config.color }} />
              <div className="size-2 rounded-full animate-dot-2" style={{ backgroundColor: config.color }} />
              <div className="size-2 rounded-full animate-dot-3" style={{ backgroundColor: config.color }} />
            </div>
          )}

          {/* Error icon */}
          {micState === 'ERROR' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}

          <span className="font-inter text-[13.6px] font-semibold" style={{ color: textColor }}>
            {label}
          </span>
        </div>

        {/* ── Separator + action buttons (only when not error) ── */}
        {micState !== 'ERROR' && (onPause || onEnd) && (
          <>
            {/* Thin vertical separator */}
            <div className="w-px h-5 bg-neutral-500 self-center" />

            {/* Action buttons */}
            <div className="flex items-center gap-1 py-1.5 pl-2 pr-2">
              {onPause && (
                <button
                  onClick={onPause}
                  title="Pause session"
                  className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <PauseIcon className="w-5 h-5" />
                </button>
              )}
              {onEnd && (
                <button
                  onClick={onEnd}
                  title="End session"
                  className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
