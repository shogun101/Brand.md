'use client';
import { useRouter } from 'next/navigation';
import { generateExportZip, downloadZip } from '@/lib/export';
import Navbar from '../../components/Navbar';

interface SectionData {
  title: string;
  content: string;
}

interface SessionDetail {
  id: string;
  brand_name: string;
  module: string | null;
  agent: string | null;
  duration_seconds: number | null;
  created_at: string;
  document: Record<string, SectionData> | null;
  kit_data: Record<string, unknown> | null;
}

export default function SessionDetailClient({ session }: { session: SessionDetail }) {
  const router = useRouter();

  const moduleLabel = session.module
    ? session.module.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Session';
  const agentLabel = session.agent
    ? session.agent.charAt(0).toUpperCase() + session.agent.slice(1)
    : 'Unknown';

  const durationSeconds = session.duration_seconds ?? 0;
  const mm = String(Math.floor(durationSeconds / 60)).padStart(2, '0');
  const ss = String(durationSeconds % 60).padStart(2, '0');

  const sections = session.document ? Object.entries(session.document) : [];

  const handleDownload = async () => {
    const exportData = {
      id: session.id,
      brand_name: session.brand_name,
      module: session.module ?? '',
      agent: session.agent ?? '',
      duration_seconds: durationSeconds,
      created_at: session.created_at,
      document: session.document ?? {},
    };
    const blob = await generateExportZip(exportData);
    const slug = session.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadZip(blob, `${slug}-${session.module ?? 'session'}`);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-brand-sidebar">
      <Navbar
        activeLink="sessions"
        onSessionsClick={() => router.push('/sessions')}
        onSettingsClick={() => {}}
      />

      <main
        className="absolute inset-x-0 bottom-0 overflow-y-auto"
        style={{ top: '56px' }}
      >
        <div className="mx-auto max-w-[800px] px-6 py-12">
          {/* Back */}
          <button
            onClick={() => router.push('/sessions')}
            className="mb-8 font-inter text-[13px] text-neutral-200 transition-colors hover:text-neutral-50"
          >
            ← Back to Sessions
          </button>

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="font-awesome-serif text-[24px] text-neutral-50">
                {session.brand_name || 'Untitled'}
              </h1>
              <p className="mt-1 font-inter text-[13px] text-neutral-200">
                {moduleLabel} • {agentLabel} •{' '}
                {new Date(session.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                {durationSeconds > 0 && `• ${mm}:${ss}`}
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="flex h-[40px] items-center justify-center rounded-[20px] bg-brand-accent px-5 font-inter text-[13.3px] font-medium text-black transition-opacity hover:opacity-90"
            >
              Download Files
            </button>
          </div>

          {/* Sections */}
          {sections.length > 0 ? (
            <div className="space-y-8">
              {sections.map(([slug, data]) => (
                <div key={slug} className="flex gap-3">
                  <div className="w-[2px] shrink-0 rounded-full bg-brand-accent" />
                  <div className="flex-1">
                    <h3 className="font-awesome-serif text-[20px] leading-[24px] text-neutral-50 mb-2">
                      {data.title}
                    </h3>
                    <p className="font-inter text-[15.2px] leading-[24.32px] text-neutral-200 whitespace-pre-wrap">
                      {data.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[12px] border border-neutral-800 bg-[#1c1c1c] py-20 text-center">
              <p className="font-inter text-[15px] font-medium text-neutral-400">No document content</p>
              <p className="mt-1 font-inter text-[13px] text-neutral-500">
                This session may not have generated a document.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
