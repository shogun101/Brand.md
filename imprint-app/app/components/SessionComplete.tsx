'use client';
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
      <div className="flex items-center justify-between border-b border-neutral-800 px-12 pt-12 pb-4">
        <div>
          <h2 className="font-awesome-serif text-[24px] tracking-[-0.48px] text-neutral-50">
            Session Complete
          </h2>
          <p className="mt-1 font-inter text-[13px] text-neutral-200">
            Your brand files are ready to download.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex h-[40px] items-center justify-center rounded-[20px] bg-brand-accent px-5 font-inter text-[13.3px] font-medium text-black transition-opacity hover:opacity-90"
        >
          Download Files
        </button>
      </div>

      {/* Static doc */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-12 py-8 space-y-8">
        {Object.entries(sections).map(([slug, data]) => (
          <div key={slug} className="flex gap-3">
            <div className="w-[2px] shrink-0 rounded-full bg-brand-accent" />
            <div className="flex-1">
              <h3 className="font-awesome-serif text-[20px] leading-[24px] text-neutral-50 mb-2">
                {data.title}
              </h3>
              <p className="font-inter text-[15.2px] leading-[24.32px] text-neutral-200">
                {data.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-800 px-12 py-4">
        <button
          onClick={onNewSession}
          className="font-inter text-[13.3px] text-neutral-200 transition-colors hover:text-neutral-50"
        >
          Start New Session →
        </button>
      </div>
    </div>
  );
}
