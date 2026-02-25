'use client';
import { useState } from 'react';
import Link from 'next/link';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import SessionsPill from './SessionsPill';
import AccountPopover from './AccountPopover';
import BuyCreditsModal from './BuyCreditsModal';
import { useCredits } from '@/lib/use-credits';

interface NavbarProps {
  activeLink?: string;
  onSessionsClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Navbar({ activeLink, onSessionsClick }: NavbarProps) {
  const { isSignedIn } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { credits, maxCredits, isFreeTrial } = useCredits();

  return (
    <>
    <nav className="absolute inset-x-0 top-0 z-50 flex h-[56px] items-center justify-between border-b border-neutral-800 bg-brand-dark px-6">
      {/* Logo — clicking navigates home */}
      <Link
        href="/"
        className="font-awesome-serif text-[18px] text-white transition-opacity hover:opacity-80"
      >
        Brand.md
      </Link>

      {/* Right links + avatar */}
      <div className="flex items-center gap-5">
        <button
          onClick={onSessionsClick}
          className={`cursor-pointer font-inter text-[13.6px] font-medium transition-colors ${
            activeLink === 'sessions' ? 'text-neutral-50' : 'text-neutral-200'
          } hover:text-neutral-50`}
        >
          Sessions
        </button>
        {isSignedIn ? (
          <>
            <div className="relative">
              <SessionsPill
                credits={credits}
                maxCredits={maxCredits}
                isFreeTrial={isFreeTrial}
                onUpgradeClick={() => setPopoverOpen(prev => !prev)}
              />
              <AccountPopover
                isOpen={popoverOpen}
                onClose={() => setPopoverOpen(false)}
                onUpgrade={() => { setPopoverOpen(false); setModalOpen(true); }}
              />
            </div>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <SignInButton mode="modal">
            <button className="flex size-8 items-center justify-center rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.5)] text-neutral-400 text-xs font-inter hover:opacity-80 transition-opacity">
              Log in
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
    <BuyCreditsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
