'use client';

interface FloatingBarProps {
  agentName?: string;
  onStartSession?: () => void;
  label?: string;
}

export default function FloatingBar({
  agentName = 'STRATEGIST',
  onStartSession,
  label,
}: FloatingBarProps) {
  return (
    <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center">
      <div className="flex items-center gap-4 rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.67)] py-2 pl-4 pr-2 shadow-[0px_10px_40px_0px_rgba(0,0,0,0.5)] backdrop-blur-[6px]">
        {/* Audio bars */}
        <div className="flex items-center gap-3">
          <div className="flex h-2 items-center gap-[3px]">
            {[8, 8, 8, 8].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-[2px] bg-[rgba(255,255,255,0.16)]"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <span className="font-inter text-[13.6px] font-semibold text-[rgba(237,237,237,0.72)]">
            {label || agentName}
          </span>
        </div>
        {/* CTA */}
        {onStartSession && (
          <button
            onClick={onStartSession}
            className="flex h-8 items-center justify-center rounded-full bg-neutral-50 px-3 font-awesome-serif text-xs text-black shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90"
          >
            Start Session
          </button>
        )}
      </div>
    </div>
  );
}
