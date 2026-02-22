'use client';

interface NavbarProps {
  activeLink?: string;
  onSessionsClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Navbar({ activeLink, onSessionsClick }: NavbarProps) {
  return (
    <nav className="absolute inset-x-0 top-0 z-50 flex h-[56px] items-center justify-between border-b border-neutral-800 bg-brand-dark px-6">
      {/* Logo — Brand.md in Awesome Serif */}
      <span className="font-awesome-serif text-[18px] text-white">Brand.md</span>

      {/* Right links + avatar */}
      <div className="flex items-center gap-5">
        <button
          onClick={onSessionsClick}
          className={`font-inter text-[13.6px] font-medium transition-colors ${
            activeLink === 'sessions' ? 'text-neutral-50' : 'text-neutral-200'
          } hover:text-neutral-50`}
        >
          Sessions
        </button>
        <div className="size-[28px] rounded-full border border-neutral-400 bg-neutral-600" />
      </div>
    </nav>
  );
}
