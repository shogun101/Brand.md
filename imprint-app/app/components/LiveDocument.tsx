'use client';
import { useEffect, useState, useRef } from 'react';

interface SectionData {
  title: string;
  content: string;
}

interface LiveDocumentProps {
  sections: Record<string, SectionData>;
  elapsedSeconds: number;
  onPause?: () => void;
  onEnd?: () => void;
  expectedSections?: string[];
}

function TypedText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const prevRef = useRef('');

  useEffect(() => {
    if (text === prevRef.current) return;
    const newText = text;
    prevRef.current = newText;
    setDone(false);

    let i = displayed.length;
    const interval = setInterval(() => {
      if (i >= newText.length) {
        setDone(true);
        clearInterval(interval);
        return;
      }
      setDisplayed(newText.slice(0, i + 1));
      i++;
    }, 18);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="animate-blink ml-[1px] text-brand-accent">|</span>
      )}
    </span>
  );
}

function SkeletonSection() {
  return (
    <div className="mb-6">
      <div className="mb-2 h-5 w-1/3 rounded animate-shimmer" />
      <div className="space-y-2">
        <div className="h-3.5 w-[70%] rounded animate-shimmer" />
        <div className="h-3.5 w-full rounded animate-shimmer" />
        <div className="h-3.5 w-[55%] rounded animate-shimmer" />
      </div>
    </div>
  );
}

export default function LiveDocument({
  sections,
  elapsedSeconds,
  onPause,
  onEnd,
  expectedSections = [],
}: LiveDocumentProps) {
  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const ss = String(elapsedSeconds % 60).padStart(2, '0');

  const sectionEntries = Object.entries(sections);
  const capturedCount = sectionEntries.length;
  const pendingCount = Math.max(0, expectedSections.length - capturedCount);

  return (
    <div className="flex h-full flex-col bg-brand-surface">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-800 px-12 pt-12 pb-4">
        <div>
          <h2 className="font-awesome-serif text-[24px] tracking-[-0.48px] text-neutral-50">
            Brand Session
          </h2>
          <p className="mt-1 font-inter text-[13px] text-brand-accent">
            Live Capturing • {mm}:{ss}
          </p>
        </div>
        <div className="flex gap-2">
          {onPause && (
            <button
              onClick={onPause}
              className="flex h-[33.5px] w-[72px] items-center justify-center rounded-[20px] border border-[#3f3f3f] font-inter text-[13.3px] text-neutral-50 transition-opacity hover:opacity-70"
            >
              Pause
            </button>
          )}
          {onEnd && (
            <button
              onClick={onEnd}
              className="flex h-[33.5px] items-center justify-center rounded-[20px] border border-[#3f3f3f] px-4 font-inter text-[13.3px] text-neutral-200 transition-opacity hover:opacity-70"
            >
              End
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-12 py-8 space-y-8">
        {sectionEntries.map(([slug, data]) => (
          <div key={slug} className="flex gap-3">
            <div className="w-[2px] shrink-0 rounded-full bg-brand-accent" />
            <div className="flex-1">
              <h3 className="font-awesome-serif text-[20px] leading-[24px] text-neutral-50 mb-2">
                {data.title}
              </h3>
              <p className="font-inter text-[15.2px] leading-[24.32px] text-neutral-200">
                <TypedText text={data.content} />
              </p>
            </div>
          </div>
        ))}

        {/* Skeletons for pending sections */}
        {Array.from({ length: pendingCount }).map((_, i) => (
          <SkeletonSection key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
