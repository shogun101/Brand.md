/**
 * ModuleItem — Checkbox row for a session module
 *
 * Layout: [checkbox] [label] .............. [duration badge]
 *
 * @param {Object}   props
 * @param {string}   props.label      – Module name (e.g. "Brand Positioning")
 * @param {string}   props.duration   – Time estimate (e.g. "15m")
 * @param {boolean}  props.checked    – Current checked state
 * @param {Function} [props.onChange] – Toggle callback
 */
export default function ModuleItem({ label, duration, checked, onChange }) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between rounded-md border border-transparent px-[13px] py-[11px] transition-colors hover:bg-white/[0.02]">
      <div className="flex items-center gap-3">
        {/* ── Checkbox ── */}
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
          />
          {/* Unchecked box */}
          <div className="size-4 rounded border border-neutral-300 peer-checked:border-white peer-checked:bg-white transition-colors" />
          {/* Checkmark */}
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
        </div>

        {/* ── Label ── */}
        <span className="font-inter text-[14.4px] font-normal text-neutral-50">
          {label}
        </span>
      </div>

      {/* ── Duration badge ── */}
      <span className="flex h-[20px] items-center rounded bg-neutral-700 border border-neutral-800 px-[6px] font-inter text-xs font-normal text-neutral-200">
        {duration}
      </span>
    </label>
  );
}
