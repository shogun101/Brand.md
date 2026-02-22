'use client';
import { Download, RotateCcw, FileX } from 'lucide-react';
import { generateExportZip, downloadZip } from '@/lib/export';
import { useSessionStore } from '@/lib/session-store';

interface SectionData {
  title: string;
  content: string;
}

interface SessionCompleteProps {
  sections: Record<string, SectionData>;
  onNewSession?: () => void;
}

export default function SessionComplete({ sections, onNewSession }: SessionCompleteProps) {
  const { selectedAgent, selectedModules, brandName, elapsedSeconds, sessionId } =
    useSessionStore();

  const sectionEntries = Object.entries(sections);
  const hasSections = sectionEntries.length > 0;

  const handleDownload = async () => {
    const session = {
      id: sessionId || crypto.randomUUID(),
      brand_name: brandName || 'My Brand',
      module: selectedModules[0] || 'positioning',
      agent: selectedAgent,
      duration_seconds: elapsedSeconds,
      document: sections,
      created_at: new Date().toISOString(),
    };
    const blob = await generateExportZip(session);
    const slug = (session.brand_name || 'brand')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    downloadZip(blob, `${slug}-${session.module}`);
  };

  return (
    <div className="flex h-full flex-col bg-brand-surface">
      {/* Header — consistent 32px padding */}
      <div className="flex items-start justify-between border-b border-neutral-800 px-8 pt-8 pb-4">
        <div>
          <h2 className="font-awesome-serif text-[24px] tracking-[-0.48px] text-neutral-50">
            Session Complete
          </h2>
          <p className="mt-1 font-inter text-[13px]" style={{ color: '#8E8E93' }}>
            {hasSections
              ? `${sectionEntries.length} section${sectionEntries.length > 1 ? 's' : ''} captured — review and download`
              : 'Your session has ended'}
          </p>
        </div>
        {hasSections && (
          <button
            onClick={handleDownload}
            className="flex h-8 items-center gap-1.5 justify-center rounded-full bg-neutral-50 px-3 font-inter text-[12px] font-medium text-black shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            <Download size={11} fill="currentColor" />
            Download
          </button>
        )}
      </div>

      {/* Content — consistent 32px padding */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-8 py-8">
        {hasSections ? (
          <div className="space-y-10">
            {sectionEntries.map(([slug, data]) => (
              <div key={slug}>
                <h3 className="font-awesome-serif text-[20px] leading-[26px] text-neutral-50 mb-3">
                  {data.title}
                </h3>
                {/* Notion-style editable — no label, just becomes editable on click */}
                <p
                  contentEditable
                  suppressContentEditableWarning
                  className="font-inter text-[14.5px] leading-[24px] text-neutral-300 outline-none rounded-lg px-3 py-2 -mx-3 cursor-text transition-colors whitespace-pre-wrap hover:bg-neutral-800/40 focus:bg-neutral-800 focus:text-neutral-50"
                >
                  {data.content}
                </p>
                <div className="mt-8 border-t border-neutral-800/60" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-24">
            <FileX size={32} className="text-neutral-400" />
            <p className="font-inter text-[15px] font-medium text-neutral-200">
              No sections were captured
            </p>
            <p className="font-inter text-[13px] text-neutral-500">
              Try a longer session — the agent structures content as you go.
            </p>
          </div>
        )}
      </div>

      {/* Footer — full-width 48px CTA, no hint text */}
      <div className="border-t border-neutral-800 px-8 py-6">
        <button
          onClick={onNewSession}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.8)] font-inter text-[14px] font-medium text-neutral-200 transition-opacity hover:opacity-80 whitespace-nowrap"
        >
          <RotateCcw size={13} />
          Start Another Session
        </button>
      </div>
    </div>
  );
}
