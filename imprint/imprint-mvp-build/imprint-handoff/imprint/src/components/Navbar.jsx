import logoSvg from "../assets/images/logo.svg";

/**
 * Navbar — Top navigation bar
 *
 * Layout: Fixed 56px bar, logo left, links + avatar right
 * Background: #010506 with bottom border #2a2a2a
 *
 * @param {Object}   props
 * @param {string}   [props.activeLink] – "sessions" | "settings" (optional highlight)
 * @param {Function} [props.onSessionsClick]
 * @param {Function} [props.onSettingsClick]
 */
export default function Navbar({ activeLink, onSessionsClick, onSettingsClick }) {
  return (
    <nav className="absolute inset-x-0 top-0 z-50 flex h-[56px] items-center justify-between border-b border-neutral-800 bg-brand-dark px-6">
      {/* ── Logo ── */}
      <div className="flex items-center gap-[10px]">
        <img src={logoSvg} alt="Imprint logo" className="size-[18px]" />
        <span className="font-inter text-[15.2px] font-semibold tracking-[-0.152px] text-neutral-50">
          Imprint
        </span>
      </div>

      {/* ── Right links + avatar ── */}
      <div className="flex items-center gap-5">
        <button
          onClick={onSessionsClick}
          className={`font-inter text-[13.6px] font-medium transition-colors ${
            activeLink === "sessions" ? "text-neutral-50" : "text-neutral-200"
          } hover:text-neutral-50`}
        >
          Sessions
        </button>
        <button
          onClick={onSettingsClick}
          className={`font-inter text-[13.6px] font-medium transition-colors ${
            activeLink === "settings" ? "text-neutral-50" : "text-neutral-200"
          } hover:text-neutral-50`}
        >
          Settings
        </button>

        {/* Avatar placeholder */}
        <div className="size-[28px] rounded-full border border-neutral-400 bg-neutral-600" />
      </div>
    </nav>
  );
}
