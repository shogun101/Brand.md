'use client';

interface ModuleItemProps {
  label: string;
  duration: string;
  description?: string;
  checked: boolean;
  locked?: boolean;
  onChange?: () => void;
}

export default function ModuleItem({ label, duration, description, checked, locked = false, onChange }: ModuleItemProps) {
  return (
    <label
      className={`flex w-full items-center justify-between rounded-md border border-transparent -ml-[13px] px-[13px] py-[11px] transition-colors ${
        locked ? 'cursor-default opacity-70' : 'cursor-pointer hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={locked ? false : checked}
            onChange={locked ? undefined : onChange}
            disabled={locked}
            className="peer sr-only"
          />
          <div className={`size-4 rounded border transition-colors ${
            locked
              ? 'border-neutral-300'
              : 'border-neutral-300 peer-checked:border-white peer-checked:bg-white'
          }`} />
          {!locked && (
            <svg
              className="pointer-events-none absolute inset-0 size-4 opacity-0 peer-checked:opacity-100"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 8.5L6.5 11L12 5.5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
          <div className="flex flex-col">
            <span className="font-inter text-[14.4px] font-normal text-neutral-50">{label}</span>
            {description && (
              <p className="font-inter text-[11px] text-[#8E8E93] leading-tight mt-0.5">{description}</p>
            )}
          </div>
      </div>

      {locked ? (
        <span className="flex items-center justify-center rounded border border-neutral-800 bg-neutral-700 px-[7px] py-[3px] font-inter text-xs font-normal text-neutral-200">
          LOCKED
        </span>
      ) : (
        <span className="flex h-[20px] items-center rounded border border-neutral-800 bg-neutral-700 px-[6px] font-inter text-xs font-normal text-neutral-200">
          {duration}
        </span>
      )}
    </label>
  );
}
