'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * BuyCreditsModal — Purchase modal for Brand Kit ($29)
 *
 * Figma node: 620:784
 * Visual: Dark card (#09090b), 420×452, rounded-24, centered overlay
 *
 * Flow:
 *  1. User clicks "pay now"
 *  2. POST /api/checkout → { checkout_url }
 *  3. Redirect to checkout_url
 *
 * @param isOpen    – Controls modal visibility
 * @param onClose   – Called when X or Cancel is clicked
 */
interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'purchase' | 'code';
}

export default function BuyCreditsModal({ isOpen, onClose, initialView = 'purchase' }: BuyCreditsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'purchase' | 'code'>(initialView);
  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');

  // Reset all state when modal opens or closes — respect initialView on open
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setPromoInput('');
      setError(null);
    } else {
      setView('purchase');
      setPromoInput('');
      setAppliedCode('');
      setError(null);
    }
  }, [isOpen, initialView]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleApplyCode = useCallback(() => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setAppliedCode(code);
    setView('purchase');
  }, [promoInput]);

  const handlePayNow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body: { discount_code?: string } = {};
      if (appliedCode) body.discount_code = appliedCode;
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data: { checkout_url?: string; error?: string } = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (res.status === 401) {
        setError('Please sign in to continue.');
      } else {
        setError(data.error ?? 'Checkout unavailable — please try again.');
        console.error('[BuyCredits] No checkout_url in response:', data);
      }
    } catch (err) {
      console.error('[BuyCredits] Checkout failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [appliedCode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Card — Figma: 420×452, bg #09090b, rounded-24 */}
      <div className="relative z-10 w-[calc(100vw-32px)] max-w-[420px] rounded-[24px] border border-[rgba(42,42,42,0.44)] bg-[#09090b] p-[20px]">
        <div className="flex flex-col gap-[24px]">

        {/* ── CODE VIEW ── */}
        {view === 'code' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView('purchase')}
                className="font-inter text-[13px] text-[rgba(237,237,237,0.5)] transition-opacity hover:opacity-70"
              >
                ← back
              </button>
              <button
                onClick={onClose}
                className="flex size-[20px] items-center justify-center transition-opacity hover:opacity-70"
              >
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15" stroke="#EDEDED" strokeOpacity={0.88} strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 5L15 15" stroke="#EDEDED" strokeOpacity={0.88} strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Icon + title */}
            <div className="flex flex-col items-center gap-[12px] py-[8px]">
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="rgba(237,237,237,0.5)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <span className="font-inter text-[14px] font-semibold text-[rgba(237,237,237,0.88)]">
                Redeem a code
              </span>
              <span className="font-inter text-[12px] text-[#71717a]">
                enter a promo code for a discount
              </span>
            </div>

            {/* Input */}
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
              placeholder="ENTER CODE"
              className="h-[46px] w-full rounded-[12px] border border-[rgba(42,42,42,0.5)] bg-[#18181b] px-[16px] font-inter text-[13px] tracking-widest text-[rgba(237,237,237,0.88)] placeholder:text-[#52525b] outline-none focus:border-neutral-600"
            />

            {/* Apply button */}
            <button
              onClick={handleApplyCode}
              disabled={!promoInput.trim()}
              className="flex h-[46px] w-full items-center justify-center rounded-[38px] bg-[#e4e4e7] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <span className="-translate-y-[2px] font-awesome-serif text-[20px] leading-none text-black">
                apply
              </span>
            </button>
          </>
        )}

        {/* ── PURCHASE VIEW ── */}
        {view === 'purchase' && (<>
          {/* ── Header + Price ── */}
          <div className="flex flex-col gap-[36px]">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <span className="font-inter text-[14px] font-semibold text-[rgba(237,237,237,0.88)]">
                Buy Credits
              </span>
              <button
                onClick={onClose}
                className="flex size-[20px] items-center justify-center transition-opacity hover:opacity-70"
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15"
                    stroke="#EDEDED"
                    strokeOpacity={0.88}
                    strokeWidth={1.66667}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 5L15 15"
                    stroke="#EDEDED"
                    strokeOpacity={0.88}
                    strokeWidth={1.66667}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Price + subtitle */}
            <div className="flex flex-col items-center gap-[36px]">
              <p className="font-awesome-serif text-[64px] font-bold leading-[48px] text-[#e4e4e7]">
                $29
              </p>
              <div className="flex items-center gap-[10px]">
                <span className="font-inter text-[14px] font-semibold uppercase text-[rgba(237,237,237,0.72)]">
                  ALL 4 MODULES
                </span>
                <span className="size-[4.375px] rounded-full bg-[rgba(237,237,237,0.72)]" />
                <span className="font-inter text-[14px] font-semibold uppercase text-[rgba(237,237,237,0.72)]">
                  Upto 5 Sessions
                </span>
              </div>
            </div>
          </div>

          {/* ── Details + Actions ── */}
          <div className="flex flex-col gap-[24px]">
            {/* Info card */}
            <div className="overflow-hidden rounded-[16px] border border-[rgba(42,42,42,0.5)] bg-[#18181b]">
              <div className="flex items-center justify-between px-[16px] py-[12px]">
                <span className="font-inter text-[14px] font-normal leading-[20px] text-[#71717a]">
                  available modules
                </span>
                <span className="font-inter text-[14px] font-normal leading-[20px] text-[#e4e4e7]">
                  4 modules
                </span>
              </div>
              <div className="h-px w-full bg-[rgba(42,42,42,0.5)]" />
              <div className="flex items-center justify-between px-[16px] py-[12px]">
                <span className="font-inter text-[14px] font-normal leading-[20px] text-[#71717a]">
                  agent access
                </span>
                <span className="font-inter text-[14px] font-normal leading-[20px] text-[#e4e4e7]">
                  all 3 agents
                </span>
              </div>
            </div>

            {/* Offer text */}
            <p className="text-center font-inter text-[12px] font-normal leading-[16px]">
              <span className="text-[#71717a]">limited-time offer: </span>
              <span className="text-neutral-50">new modules added weekly</span>
            </p>

            {/* Action buttons */}
            <div className="flex flex-col items-center gap-[17px]">
              <div className="flex w-full gap-[12px]">
                {/* Cancel */}
                <button
                  onClick={onClose}
                  className="flex h-[46px] flex-1 items-center justify-center rounded-[38px] bg-[#18181b] transition-opacity hover:opacity-80"
                >
                  <span className="-translate-y-[2px] font-awesome-serif text-[20px] leading-none text-[#e4e4e7]">
                    cancel
                  </span>
                </button>

                {/* Pay now */}
                <button
                  onClick={handlePayNow}
                  disabled={loading}
                  className="flex h-[46px] flex-1 items-center justify-center rounded-[38px] bg-[#e4e4e7] transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <span className="-translate-y-[2px] font-awesome-serif text-[20px] leading-none text-black">
                    {loading ? 'processing...' : 'pay now'}
                  </span>
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-center font-inter text-[12px] font-normal leading-[16px] text-red-400">
                  {error}
                </p>
              )}

              {/* Applied code indicator */}
              {appliedCode && (
                <p className="text-center font-inter text-[12px] font-normal leading-[16px] text-emerald-400">
                  code applied: {appliedCode}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-center gap-[6px] font-inter text-[12px] font-normal leading-[16px] text-[#52525b]">
                <span>secured by dodo payments</span>
                <span>·</span>
                <button
                  onClick={() => { setView('code'); setError(null); }}
                  className="underline decoration-solid hover:text-neutral-400 transition-colors cursor-pointer"
                >
                  have a code?
                </button>
              </div>
            </div>
          </div>
        </>) }

        </div>
      </div>
    </div>
  );
}
