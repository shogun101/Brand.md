'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, StopCircle } from 'lucide-react';
import type { TranscriptEntry } from '@/lib/session-store';

interface SectionData {
  title: string;
  content: string;
}

interface LiveDocumentProps {
  sections: Record<string, SectionData>;
  transcript: TranscriptEntry[];
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
    prevRef.current = text;
    setDone(false);
    let i = displayed.length;
    const interval = setInterval(() => {
      if (i >= text.length) { setDone(true); clearInterval(interval); return; }
      setDisplayed(text.slice(0, i + 1));
      i++;
    }, 18);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-blink ml-[1px] text-brand-accent">|</span>}
    </span>
  );
}

function ListeningPulse() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-24">
      <div className="flex gap-[5px] items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-2 rounded-full bg-neutral-600 animate-dot-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="font-inter text-[13px] text-neutral-500">
        Listening — content will appear as the session progresses
      </p>
    </div>
  );
}

export default function LiveDocument({
  sections,
  transcript,
  elapsedSeconds,
  onPause,
  onEnd,
}: LiveDocumentProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const ss = String(elapsedSeconds % 60).padStart(2, '0');

  const sectionEntries = Object.entries(sections);
  const hasSections = sectionEntries.length > 0;
  const hasTranscript = transcript.length > 0;

  // Auto-scroll to bottom when transcript grows
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.length]);

  return (
    <div className="flex h-full flex-col bg-brand-surface">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-800 px-12 pt-12 pb-4">
        <div>
          <h2 className="font-awesome-serif text-[24px] tracking-[-0.48px] text-neutral-50">
            Brand Session
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <div className="size-[7px] rounded-full bg-[#FF3B30] animate-pulse" />
            <p className="font-inter text-[13px] text-[#8E8E93]">
              Live Capturing • {mm}:{ss}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {onPause && (
            <button
              onClick={onPause}
              className="flex h-8 items-center gap-1.5 justify-center rounded-full border border-[#3f3f3f] px-3 font-inter text-[12px] text-neutral-300 transition-opacity hover:opacity-70"
            >
              <Pause size={11} fill="currentColor" />
              Pause
            </button>
          )}
          {onEnd && (
            <button
              onClick={onEnd}
              className="flex h-8 items-center gap-1.5 justify-center rounded-full bg-neutral-50 px-3 font-inter text-[12px] text-black shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90"
            >
              <StopCircle size={11} fill="currentColor" />
              End
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-12 py-8 space-y-8">

        {/* Captured sections — appear as the AI structures them */}
        {hasSections && (
          <div className="space-y-8">
            {sectionEntries.map(([slug, data]) => (
              <div key={slug} className="flex gap-3">
                <div className="w-[2px] shrink-0 rounded-full bg-brand-accent" />
                <div className="flex-1">
                  <h3 className="font-awesome-serif text-[18px] leading-[22px] text-neutral-50 mb-2">
                    {data.title}
                  </h3>
                  <p className="font-inter text-[14px] leading-[22px] text-neutral-200">
                    <TypedText text={data.content} />
                  </p>
                </div>
              </div>
            ))}
            {/* Divider between sections and transcript */}
            {hasTranscript && (
              <div className="border-t border-neutral-800 pt-6">
                <p className="font-inter text-[11px] uppercase tracking-[0.56px] text-neutral-500 mb-4">
                  Conversation
                </p>
              </div>
            )}
          </div>
        )}

        {/* Live transcript */}
        {hasTranscript ? (
          <div className="space-y-3">
            {transcript.map((entry) => (
              <div
                key={entry.id}
                className={`flex gap-3 ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {entry.role === 'ai' && (
                  <div className="size-6 shrink-0 rounded-full bg-neutral-700 flex items-center justify-center mt-0.5">
                    <div className="size-2 rounded-full bg-brand-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    entry.role === 'ai'
                      ? 'bg-neutral-800 text-neutral-100'
                      : 'bg-neutral-700 text-neutral-50'
                  }`}
                >
                  <p className="font-inter text-[13.5px] leading-[20px]">{entry.text}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        ) : (
          !hasSections && <ListeningPulse />
        )}
      </div>
    </div>
  );
}
