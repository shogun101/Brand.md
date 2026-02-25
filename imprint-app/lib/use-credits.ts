import { create } from 'zustand';

/**
 * useCredits — Zustand store for credits/monetization state
 *
 * Business rules:
 *  - New users start with 1 free session (isFreeTrial = true)
 *  - After using the free session OR buying a Brand Kit, isFreeTrial = false
 *  - Brand Kit costs $29 and gives 5 sessions
 *  - Each completed session consumes 1 credit
 *
 * In production, this would be hydrated from Supabase on auth.
 * For now, it's client-only with localStorage persistence.
 */

interface CreditsStore {
  credits: number;
  maxCredits: number;
  isFreeTrial: boolean;

  /** Called after a successful Brand Kit purchase */
  addCredits: (amount: number) => void;

  /** Called when a session is completed */
  consumeCredit: () => void;

  /** Hydrate from server data (e.g. after login) */
  hydrate: (data: { credits: number; maxCredits: number; isFreeTrial: boolean }) => void;
}

export const useCredits = create<CreditsStore>((set) => ({
  // Defaults: new user with 1 free trial session
  credits: 1,
  maxCredits: 1,
  isFreeTrial: true,

  addCredits: (amount) =>
    set((s) => ({
      credits: s.credits + amount,
      maxCredits: amount, // reset max to new plan total
      isFreeTrial: false,
    })),

  consumeCredit: () =>
    set((s) => ({
      credits: Math.max(0, s.credits - 1),
      isFreeTrial: s.isFreeTrial && s.credits <= 1 ? false : s.isFreeTrial,
    })),

  hydrate: (data) =>
    set({
      credits: data.credits,
      maxCredits: data.maxCredits,
      isFreeTrial: data.isFreeTrial,
    }),
}));
