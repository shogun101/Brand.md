'use client';
import { useRouter } from 'next/navigation';
import { generateExportZip, downloadZip } from '@/lib/export';
import Navbar from '../../components/Navbar';

interface SectionData {
  title: string;
  content: string;
}

interface MockSessionDetail {
  id: string;
  brand_name: string;
  module: string;
  agent: string;
  duration_seconds: number;
  created_at: string;
  document: Record<string, SectionData>;
}

const MOCK_DETAILS: Record<string, MockSessionDetail> = {
  'session-1': {
    id: 'session-1',
    brand_name: 'Acme Corp',
    module: 'positioning',
    agent: 'strategist',
    duration_seconds: 423,
    created_at: new Date('2026-02-18').toISOString(),
    document: {
      'company-overview': {
        title: 'Company Overview',
        content:
          'Acme Corp builds workflow automation software for operations teams at mid-market companies (50-500 employees). Day-to-day, they help ops managers eliminate the spreadsheet chaos that comes with scaling — connecting the tools teams already use and surfacing the data that actually matters.',
      },
      'target-audience': {
        title: 'Target Audience',
        content:
          "Primary persona: Marcus, 34, Director of Operations at a 200-person e-commerce company. On a Tuesday morning he's already in four Slack channels, has three browser tabs of Google Sheets open, and is wondering why a process that should take 10 minutes is taking two hours. His core frustration: data lives in six different places and nobody can agree on which number is right.",
      },
      'value-proposition': {
        title: 'Unique Value Proposition',
        content:
          "The only ops platform built for the \"spreadsheet-to-scale\" transition. Unlike generic automation tools that assume you've already figured out your processes, Acme meets you in the middle — works with your existing mess while nudging you toward better systems. You don't have to earn the right to use it.",
      },
      'positioning-statement': {
        title: 'Positioning Statement',
        content:
          'For operations managers at growing companies who are drowning in disconnected tools, Acme is the workflow platform that brings order to the chaos — without requiring you to burn everything down and start over — because it works with how your team actually operates today.',
      },
    },
  },
  'session-2': {
    id: 'session-2',
    brand_name: 'Acme Corp',
    module: 'voice-tone',
    agent: 'creative',
    duration_seconds: 318,
    created_at: new Date('2026-02-10').toISOString(),
    document: {
      'brand-personality': {
        title: 'Brand Personality',
        content:
          'In three words: Direct, Warm, Practical. Never: Corporate, Jargony, Self-congratulatory. Character: That smart friend who works in tech and actually explains things clearly at dinner without making you feel dumb for not knowing.',
      },
      'voice-guardrails': {
        title: 'Voice Guardrails',
        content:
          'Always: Use contractions. Write like you talk. Name the specific thing. Never: "leverage", "synergy", "ecosystem", "best-in-class", "game-changing". If a sentence could appear in a McKinsey deck, rewrite it.',
      },
      'formality-spectrum': {
        title: 'Formality Spectrum',
        content:
          'Smart casual — contractions always, first person, no jargon unless audience uses it first. Register: Smart friend explaining over coffee. More podcast conversation than TED talk. More group chat than Wikipedia.',
      },
    },
  },
  'session-3': {
    id: 'session-3',
    brand_name: 'Acme Corp',
    module: 'vision-values',
    agent: 'coach',
    duration_seconds: 396,
    created_at: new Date('2026-01-29').toISOString(),
    document: {
      'vision-statement': {
        title: 'Vision',
        content:
          'A world where every operations team — not just the ones at companies with a 50-person IT department — can run with the efficiency of a Fortune 500. Where scaling a company doesn\'t mean scaling your chaos.',
      },
      'mission-statement': {
        title: 'Mission',
        content:
          'We make the operational infrastructure that used to take a team of consultants and six months to build, available in an afternoon — to any ops manager with a laptop and a problem to solve.',
      },
      'brand-promise': {
        title: 'Brand Promise',
        content:
          'You\'ll get more done this week than you did last month. If you don\'t see a meaningful improvement in how your team operates within 30 days, we\'ll work with you until you do — or give you your money back.',
      },
    },
  },
};

export default function SessionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const session = MOCK_DETAILS[params.id];

  if (!session) {
    return (
      <div className="relative h-screen w-screen bg-brand-sidebar">
        <Navbar onSessionsClick={() => router.push('/sessions')} />
        <div className="flex h-full items-center justify-center">
          <p className="font-inter text-neutral-200">Session not found.</p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    const blob = await generateExportZip(session);
    const slug = session.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadZip(blob, `${slug}-${session.module}`);
  };

  const mm = String(Math.floor(session.duration_seconds / 60)).padStart(2, '0');
  const ss = String(session.duration_seconds % 60).padStart(2, '0');

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
                {session.brand_name}
              </h1>
              <p className="mt-1 font-inter text-[13px] text-neutral-200">
                {session.module} • {session.agent} •{' '}
                {new Date(session.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                • {mm}:{ss}
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
          <div className="space-y-8">
            {Object.entries(session.document).map(([slug, data]) => (
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
        </div>
      </main>
    </div>
  );
}
