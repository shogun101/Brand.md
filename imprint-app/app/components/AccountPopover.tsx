'use client';

import { useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useCredits } from '@/lib/use-credits';

/**
 * AccountPopover — Dropdown shown when clicking the sessions pill
 *
 * Figma node: 620:1816
 * Shows user info, session count, upgrade button, and sign out.
 *
 * Flow: "Upgrade plan" → triggers onUpgrade (opens BuyCreditsModal)
 */
interface AccountPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onSignOut?: () => void;
}

export default function AccountPopover({
  isOpen,
  onClose,
  onUpgrade,
  onSignOut,
}: AccountPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const { credits, maxCredits } = useCredits();

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid capturing the pill click that opened us
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[224px] overflow-hidden rounded-[12px] border border-[#27272a] bg-[#18181b] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]"
    >
      {/* User row */}
      <div className="flex items-center gap-[8px] border-b border-[#27272a] px-[16px] py-[12px]">
        {/* Avatar */}
        <div className="size-[24px] shrink-0 rounded-full border border-[#3f3f46] bg-neutral-600" />
        <span className="truncate font-inter text-[12px] font-medium text-[#71717a]">
          {user?.primaryEmailAddress?.emailAddress ?? ''}
        </span>
      </div>

      {/* Sessions count section */}
      <div className="flex flex-col items-center gap-[16px] border-b border-[#27272a] bg-[#0f0f11] px-[16px] py-[20px]">
        {/* Count + label */}
        <div className="flex flex-col items-center gap-[12px]">
          <p className="font-awesome-serif text-[32px] font-bold lowercase leading-[22px]">
            <span className="text-[#e4e4e7]">{credits} </span>
            <span className="text-[#8e8e93]">/ {maxCredits} </span>
          </p>
          <span className="font-inter text-[10px] font-semibold uppercase text-[#8e8e93]">
            Sessions remaining
          </span>
        </div>

        {/* Actions */}
        <div className="flex w-[190px] flex-col gap-[8px]">
          {/* Upgrade plan button */}
          <button
            onClick={() => {
              onClose();
              onUpgrade();
            }}
            className="flex h-[28px] w-full items-center justify-center rounded-[38px] bg-[#e4e4e7] transition-opacity hover:opacity-90"
          >
            <span className="-translate-y-px font-awesome-serif text-[13px] leading-none text-black">
              Upgrade plan
            </span>
          </button>

          {/* Have a code? */}
          <button className="flex h-[28px] w-full items-center justify-center gap-[6px] transition-opacity hover:opacity-80">
            {/* Gift icon */}
            <svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 12v10H4V12" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="2" y="7" width="20" height="5" rx="1" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22V7" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-inter text-[12px] font-medium text-[#71717a]">
              have a code?
            </span>
          </button>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={() => {
          onClose();
          onSignOut?.();
          void signOut();
        }}
        className="flex h-[40px] w-full items-center gap-[12px] px-[16px] transition-colors hover:bg-white/[0.03]"
      >
        {/* Sign out arrow icon */}
        <svg
          width={15}
          height={15}
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.625 13.125H3.125C2.78125 13.125 2.45312 12.9883 2.20938 12.7445C1.96563 12.5008 1.875 12.1719 1.875 11.875V3.125C1.875 2.78125 1.96563 2.45312 2.20938 2.20938C2.45312 1.96563 2.78125 1.875 3.125 1.875H5.625"
            stroke="#a1a1aa"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 10.625L13.125 7.5L10 4.375"
            stroke="#a1a1aa"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.125 7.5H5.625"
            stroke="#a1a1aa"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-inter text-[14px] font-medium text-[#a1a1aa]">
          sign out
        </span>
      </button>
    </div>
  );
}
