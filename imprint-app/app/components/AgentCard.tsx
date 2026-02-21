'use client';

interface AgentCardProps {
  name: string;
  role: string;
  image: string;
  overlay?: string | null;
  selected?: boolean;
  onClick?: () => void;
}

export default function AgentCard({
  name,
  role,
  image,
  overlay,
  selected = false,
  onClick,
}: AgentCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative h-[128px] w-[100px] shrink-0 overflow-hidden rounded-3xl border transition-all ${
        selected
          ? 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
          : 'border-neutral-800 hover:border-neutral-600'
      }`}
    >
      <div className="absolute inset-0 bg-brand-surface" />
      <img
        src={image}
        alt=""
        className="absolute inset-0 size-full rounded-3xl object-cover"
        aria-hidden="true"
      />
      {overlay && (
        <img
          src={overlay}
          alt=""
          className="absolute inset-0 size-full rounded-3xl object-cover"
          aria-hidden="true"
        />
      )}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-b backdrop-blur-[1px] ${
          selected
            ? 'from-transparent to-[rgba(0,0,0,0.7)] border border-white/20'
            : 'from-transparent to-black border border-black'
        }`}
      />
      <div className="absolute bottom-[16px] left-[11px] flex w-[96px] flex-col items-start gap-[6px]">
        <span
          className={`w-full font-inter text-[13.6px] font-semibold ${
            selected ? 'text-neutral-50' : 'text-[rgba(237,237,237,0.72)]'
          }`}
        >
          {name}
        </span>
        <span className="w-full font-inter text-[11.2px] font-normal uppercase tracking-[0.56px] text-neutral-200">
          {role}
        </span>
      </div>
    </button>
  );
}
