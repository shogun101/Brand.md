'use client';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';

interface MockSession {
  id: string;
  title: string;
  agent: string;
  date: string;
  moduleCount: number;
  summary: string;
  icon: string;
  module: string;
}

const MOCK_SESSIONS: MockSession[] = [
  {
    id: 'session-1',
    title: 'Brand Positioning',
    agent: 'Strategist',
    date: 'Feb 18',
    moduleCount: 1,
    summary:
      'Defined core positioning for a B2B SaaS platform targeting operations teams at mid-market companies. Identified key differentiators vs. legacy tools.',
    icon: '✦',
    module: 'positioning',
  },
  {
    id: 'session-2',
    title: 'Voice & Tone',
    agent: 'Creative',
    date: 'Feb 10',
    moduleCount: 2,
    summary:
      'Established brand voice as "smart friend over coffee" — direct, warm, never corporate. Banned: synergy, leverage, ecosystem.',
    icon: '✎',
    module: 'voice-tone',
  },
  {
    id: 'session-3',
    title: 'Vision & Values',
    agent: 'Coach',
    date: 'Jan 29',
    moduleCount: 1,
    summary:
      'Articulated 5-year vision around making brand strategy accessible to every early-stage founder. Three core principles with real-world examples.',
    icon: '⬡',
    module: 'vision-values',
  },
];

function SessionCard({ session, onClick }: { session: MockSession; onClick: () => void }) {
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
            <p className="font-inter text-[16px] font-medium text-neutral-50">{session.title}</p>
            <p className="mt-0.5 font-inter text-[12px] text-neutral-300">
              {session.agent} • {session.date} • {session.moduleCount}{' '}
              {session.moduleCount === 1 ? 'Module' : 'Modules'}
            </p>
          </div>
          <p className="font-inter text-[13.6px] leading-[20.4px] text-neutral-200 line-clamp-2">
            {session.summary}
          </p>
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

export default function SessionsPage() {
  const router = useRouter();

  return (
    /* bg-brand-surface matches homepage dark background (#141414) */
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
          <div className="overflow-hidden rounded-[12px] border border-neutral-800 bg-[#1c1c1c]">
            {MOCK_SESSIONS.map((session, index) => (
              <div key={session.id}>
                {index > 0 && <div className="h-px bg-neutral-800" />}
                <SessionCard
                  session={session}
                  onClick={() => router.push(`/sessions/${session.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
