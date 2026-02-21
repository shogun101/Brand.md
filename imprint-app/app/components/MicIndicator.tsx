'use client';

type MicState = 'READY' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';

interface MicIndicatorProps {
  micState: MicState;
}

const stateConfig = {
  READY: {
    label: 'Ready',
    barColor: 'rgba(255,255,255,0.3)',
    showBars: true,
    animated: false,
  },
  LISTENING: {
    label: 'Listening...',
    barColor: '#46a758',
    showBars: true,
    animated: true,
  },
  PROCESSING: {
    label: 'Thinking...',
    barColor: '#d97706',
    showBars: false,
    animated: false,
  },
  AI_SPEAKING: {
    label: 'Speaking...',
    barColor: 'rgba(255,255,255,0.16)',
    showBars: true,
    animated: false,
  },
  ERROR: {
    label: 'Connection lost',
    barColor: '#dc2626',
    showBars: true,
    animated: false,
  },
};

const animClasses = ['animate-bar-1', 'animate-bar-2', 'animate-bar-3', 'animate-bar-4'];

export default function MicIndicator({ micState }: MicIndicatorProps) {
  const config = stateConfig[micState];

  return (
    <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center">
      <div className="flex items-center gap-4 rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.67)] py-2 pl-4 pr-4 shadow-[0px_10px_40px_0px_rgba(0,0,0,0.5)] backdrop-blur-[6px]">
        {config.showBars ? (
          <div className="flex h-4 items-center gap-[3px]">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-[3px] rounded-[2px] ${config.animated ? animClasses[i] : ''}`}
                style={{
                  height: config.animated ? '8px' : '8px',
                  backgroundColor: config.barColor,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-[6px]">
            <div className="size-2 rounded-full animate-dot-1" style={{ backgroundColor: config.barColor }} />
            <div className="size-2 rounded-full animate-dot-2" style={{ backgroundColor: config.barColor }} />
            <div className="size-2 rounded-full animate-dot-3" style={{ backgroundColor: config.barColor }} />
          </div>
        )}
        <span
          className="font-inter text-[13.6px] font-semibold"
          style={{ color: config.barColor === 'rgba(255,255,255,0.3)' || config.barColor === 'rgba(255,255,255,0.16)' ? 'rgba(237,237,237,0.72)' : config.barColor }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}
