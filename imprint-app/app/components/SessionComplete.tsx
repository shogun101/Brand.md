'use client';
import { Download, RotateCcw } from 'lucide-react';
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

  const hasSections = Object.keys(sections).length > 0;

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
      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-800 px-12 pt-12 pb-4">
        <div>
          <h2 className="font-awesome-serif text-[24px] tracking-[-0.48px] text-neutral-50">
            Session Complete
          </h2>
          <p className="mt-1 font-inter text-[13px] text-neutral-400">
            {hasSections
              ? `${Object.keys(sections).length} section${Object.keys(sections).length > 1 ? 's' : ''} captured — review and download`
              : 'Your session has ended'}
          </p>
        </div>
        {hasSections && (
          <button
            onClick={handleDownload}
            className="flex h-8 items-center gap-1.5 justify-center rounded-full bg-neutral-50 px-3 font-inter text-[12px] font-medium text-black shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            <Download size={11} />
            Download
          </button>
        )}
      </div>

      {/* Markdown preview — Notion/Granola style */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-12 py-8">
        {hasSections ? (
          <div className="space-y-10">
            {Object.entries(sections).map(([slug, data]) => (
              <div key={slug} className="group">
                {/* Section heading */}
                <h3 className="font-awesome-serif text-[20px] leading-[26px] text-neutral-50 mb-3">
                  {data.title}
                </h3>
                {/* Editable content — contentEditable for light tweaks */}
                <p
                  contentEditable
                  suppressContentEditableWarning
                  className="font-inter text-[14.5px] leading-[24px] text-neutral-300 outline-none rounded-lg px-3 py-2 -mx-3 transition-colors cursor-text hover:bg-neutral-800/50 focus:bg-neutral-800 focus:text-neutral-50 whitespace-pre-wrap"
                >
                  {data.content}
                </p>
                {/* Subtle divider */}
                <div className="mt-8 border-t border-neutral-800/60" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-24">
            <p className="font-inter text-[14px] text-neutral-500">
              No sections were captured in this session.
            </p>
            <p className="font-inter text-[12px] text-neutral-600">
              Try speaking longer — the agent structures content as you go.
            </p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-neutral-800 px-12 py-5 flex items-center justify-between">
        <p className="font-inter text-[12px] text-neutral-600">
          {hasSections ? 'Click any section to edit before downloading' : ''}
        </p>
        <button
          onClick={onNewSession}
          className="flex items-center gap-2 rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.67)] px-4 py-2 font-inter text-[13px] font-medium text-neutral-200 transition-opacity hover:opacity-80 whitespace-nowrap"
        >
          <RotateCcw size={12} />
          Start Another Session
        </button>
      </div>
    </div>
  );
}
