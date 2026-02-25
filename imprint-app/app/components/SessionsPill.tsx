'use client';

import TokenIcon from './icons/TokenIcon';

/**
 * SessionsPill — Credits indicator in the navbar
 *
 * Two visual states from Figma:
 * 1. Free Trial: White bg pill with dark solid icon + "FREE TRIAL" + "UPGRADE" badge (node 620:869)
 * 2. Credits:    Transparent pill with neutral border + solid icon + "4 / 5" count (node 620:857)
 */
interface SessionsPillProps {
  credits: number;
  maxCredits: number;
  isFreeTrial: boolean;
  onUpgradeClick: () => void;
}

export default function SessionsPill({
  credits,
  maxCredits,
  isFreeTrial,
  onUpgradeClick,
}: SessionsPillProps) {
  if (isFreeTrial) {
    return (
      <button
        onClick={onUpgradeClick}
        className="flex h-[28px] items-center gap-[6px] rounded-[40px] border border-neutral-800 bg-[#ededed] px-[6px] transition-opacity hover:opacity-90"
      >
        <TokenIcon variant="dark" size={11} solid />
        <span className="font-inter text-[13px] font-medium uppercase leading-none text-[#010506]">
          Free Trial
        </span>
        <span className="flex h-[18px] items-center justify-center rounded-[20px] bg-[#010506] px-[6px]">
          <span className="font-inter text-[10px] font-semibold leading-none text-[#ededed]">
            UPGRADE
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onUpgradeClick}
      className="flex h-[28px] items-center justify-center gap-[6px] rounded-[40px] border border-[#2a2a2a] pl-[6px] pr-[10px] transition-opacity hover:opacity-80"
    >
      <TokenIcon variant="muted" size={11} solid />
      <span className="font-inter text-[13px] font-medium leading-none">
        <span className="text-[#ededed]">{credits}</span>
        <span className="text-[#8e8e93]"> / {maxCredits}</span>
      </span>
    </button>
  );
}
