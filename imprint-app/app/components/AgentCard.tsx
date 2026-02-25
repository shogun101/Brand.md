'use client';

import LockIcon from './icons/LockIcon';

interface AgentCardProps {
  name: string;
  role: string;
  image: string;
  overlay?: string | null;
  selected?: boolean;
  locked?: boolean;
  onClick?: () => void;
}

export default function AgentCard({
  name,
  role,
  image,
  overlay,
  selected = false,
  locked = false,
  onClick,
}: AgentCardProps) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      className={`relative h-[137px] w-[120px] shrink-0 overflow-hidden rounded-3xl border transition-all ${
        locked
          ? 'cursor-default border-neutral-800'
          : selected
            ? 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
            : 'border-neutral-800 hover:border-neutral-600'
      }`}
    >
      {/* Background fill */}
      <div className="absolute inset-0 bg-brand-surface" />

      {/* Agent image */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 size-full rounded-3xl object-cover"
        aria-hidden="true"
      />

      {/* Overlay image (selected glow) */}
      {overlay && !locked && (
        <img
          src={overlay}
          alt=""
          className="absolute inset-0 size-full rounded-3xl object-cover"
          aria-hidden="true"
        />
      )}

      {/* Text labels — placed BEFORE gradient so they go behind blur when locked */}
      <div className="absolute bottom-[16px] left-[11px] z-[1] flex w-[96px] flex-col items-start gap-[6px]">
        <span
          className={`w-full font-inter text-[13.6px] font-semibold ${
            selected && !locked ? 'text-neutral-50' : 'text-[rgba(237,237,237,0.72)]'
          }`}
        >
          {name}
        </span>
        <span className="w-full font-inter text-[11.2px] font-normal uppercase tracking-[0.56px] text-neutral-200">
          {role}
        </span>
      </div>

      {/* Gradient overlay — blurs text underneath when locked */}
      <div
        className={`absolute inset-0 z-[2] rounded-3xl bg-gradient-to-b ${
          locked
            ? 'from-black/30 to-black/80 backdrop-blur-[2px]'
            : selected
              ? 'from-transparent to-[rgba(0,0,0,0.7)]'
              : 'from-transparent to-black'
        }`}
      />

      {/* Lock icon — on top of everything */}
      {locked && (
        <div className="absolute inset-0 z-[3] flex items-center justify-center">
          <LockIcon size={18} color="#EDEDED" />
        </div>
      )}
    </button>
  );
}
