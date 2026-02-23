'use client';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';

interface Session {
  id: string;
  brand_name: string;
  module: string | null;
  agent: string | null;
  duration_seconds: number | null;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(seconds: number | null) {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  return mins > 0 ? `${mins} min` : `${seconds}s`;
}

function SessionCard({ session, onClick }: { session: Session; onClick: () => void }) {
  const agentLabel = session.agent
    ? session.agent.charAt(0).toUpperCase() + session.agent.slice(1)
    : 'Unknown';
  const moduleLabel = session.module
    ? session.module.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Session';
  const durationStr = formatDuration(session.duration_seconds);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-colors hover:bg-white/[0.03] p-5"
    >
      <div className="flex gap-5">
        {/* Icon badge */}
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <DocumentTextIcon className="size-5 text-white/60" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div>
            <p className="font-inter text-[16px] font-medium text-neutral-50">
              {session.brand_name || 'Untitled'} — {moduleLabel}
            </p>
            <p className="mt-0.5 font-inter text-[12px] text-neutral-300">
              {agentLabel} • {formatDate(session.created_at)}{durationStr ? ` • ${durationStr}` : ''}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="self-start font-inter text-[12.8px] text-white/40 transition-opacity hover:text-white/70"
          >
            Open Document →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SessionsClient({ sessions }: { sessions: Session[] }) {
  const router = useRouter();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-brand-surface">
      <Navbar
        activeLink="sessions"
        onSessionsClick={() => router.push('/sessions')}
        onSettingsClick={() => {}}
      />

      <main
        className="absolute inset-x-0 bottom-0 overflow-y-auto"
        style={{ top: '56px' }}
      >
        <div className="mx-auto max-w-[800px] px-8 py-[60px]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-awesome-serif text-[27.1px] text-neutral-50">
              Past Sessions
            </h1>
            <p className="mt-2 font-inter text-[14.4px] leading-[21.6px] text-neutral-200">
              Review your brand architecture documents and transcripts.
            </p>
          </div>

          {/* Session cards container */}
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[12px] border border-neutral-800 bg-[#1c1c1c] py-20 text-center">
              <DocumentTextIcon className="mb-4 size-10 text-white/20" />
              <p className="font-inter text-[15px] font-medium text-neutral-400">No sessions yet</p>
              <p className="mt-1 font-inter text-[13px] text-neutral-500">
                Start a session from the home page to see your work here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[12px] border border-neutral-800 bg-[#1c1c1c]">
              {sessions.map((session, index) => (
                <div key={session.id}>
                  {index > 0 && <div className="h-px bg-neutral-800" />}
                  <SessionCard
                    session={session}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
