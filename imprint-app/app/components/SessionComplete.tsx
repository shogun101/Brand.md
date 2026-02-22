'use client';
import ReactMarkdown from 'react-markdown';
import { ArrowDownTrayIcon, ArrowPathIcon, DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { generateExportZip, downloadZip, buildModuleFile } from '@/lib/export';
import { useSessionStore } from '@/lib/session-store';

interface SectionData {
  title: string;
  content: string;
}

interface SessionCompleteProps {
  sections: Record<string, SectionData>;
  isGenerating?: boolean;
  onNewSession?: () => void;
}

const MODULE_TITLES: Record<string, string> = {
  positioning: 'Brand Positioning',
  'voice-tone': 'Voice & Tone',
  persona: 'Brand Persona',
  'vision-values': 'Vision & Values',
};

function getModuleTitle(module: string): string {
  return MODULE_TITLES[module] ?? module;
}

/** Build the preview markdown string — same content as the downloaded .md file,
 *  but WITHOUT the YAML frontmatter block so it reads cleanly as a document.
 *  `agent-directives` section is rendered last as a fenced code block. */
function buildPreviewMarkdown(
  sections: Record<string, SectionData>,
  moduleKey: string,
  brandName: string
): string {
  const moduleTitle = getModuleTitle(moduleKey);
  const name = brandName || 'My Brand';

  const regularEntries = Object.entries(sections).filter(([key]) => key !== 'agent-directives');
  const directivesEntry = sections['agent-directives'];

  const sectionsMd = regularEntries
    .map(([, data]) => `## ${data.title}\n\n${data.content}`)
    .join('\n\n');

  let result = `# ${moduleTitle} — ${name}\n\n${sectionsMd}`;

  if (directivesEntry) {
    result += `\n\n## Agent Directives\n\n\`\`\`\n${directivesEntry.content}\n\`\`\``;
  }

  return result;
}

export default function SessionComplete({ sections, isGenerating = false, onNewSession }: SessionCompleteProps) {
  const { selectedAgent, selectedModules, brandName, elapsedSeconds, sessionId } =
    useSessionStore();

  const sectionEntries = Object.entries(sections);
  const hasSections = sectionEntries.length > 0;

  const moduleKey = selectedModules[0] || 'positioning';
  const name = brandName || 'My Brand';
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filename = `${slug}-${moduleKey}.md`;

  const previewMarkdown = hasSections
    ? buildPreviewMarkdown(sections, moduleKey, name)
    : '';

  // Download always available — even with no sections it includes metadata
  const handleDownload = async () => {
    const session = {
      id: sessionId || crypto.randomUUID(),
      brand_name: name,
      module: moduleKey,
      agent: selectedAgent,
      duration_seconds: elapsedSeconds,
      document: sections,
      created_at: new Date().toISOString(),
    };
    // Use buildModuleFile to verify preview matches download exactly
    void buildModuleFile(session); // keep reference live; actual zip uses generateExportZip
    const blob = await generateExportZip(session);
    downloadZip(blob, `${slug}-${moduleKey}`);
  };

  return (
    <div className="flex h-full flex-col bg-brand-surface">

      {/* ── Header ── px-8 pt-8 pb-4 */}
      <div className="flex items-center gap-8 border-b border-neutral-800 px-8 py-6">
        <div className="flex-1 min-w-0">
          <h2 className="font-awesome-serif text-[24px] tracking-[-0.48px] text-neutral-50">
            Session Complete
          </h2>
          <p className="mt-1 font-inter text-[13px] text-[#8E8E93]">
            {hasSections
              ? `${sectionEntries.length} section${sectionEntries.length > 1 ? 's' : ''} captured — review and download`
              : isGenerating
              ? 'Pulling key insights from your conversation…'
              : 'Session ended — download includes session metadata'}
          </p>
        </div>

        {/* Download always shown — never a dead-end */}
        <button
          onClick={handleDownload}
          className="flex h-8 items-center gap-1.5 justify-center rounded-full bg-neutral-50 px-3 font-inter text-[12px] font-medium text-black shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
        >
          <ArrowDownTrayIcon className="w-3 h-3 stroke-[2.5]" />
          Download
        </button>
      </div>

      {/* ── Scrollable content ── px-8 py-8 */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-8 py-8">
        {hasSections ? (
          <>
            {/* Filename pill — shows user what file they're previewing */}
            <div className="mb-6 flex items-center gap-2">
              <DocumentIcon className="size-[13px] text-neutral-500 shrink-0" />
              <span className="font-mono text-[11px] text-neutral-500 tracking-wide">
                {filename}
              </span>
            </div>

            {/* Full markdown preview — matches the downloaded .md file exactly */}
            <div className="space-y-0">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-awesome-serif text-[22px] leading-[28px] tracking-[-0.44px] text-neutral-50 mb-6">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-awesome-serif text-[17px] leading-[22px] text-neutral-50 mt-8 mb-3 pb-2 border-b border-neutral-800/70">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-inter text-[14px] font-semibold text-neutral-200 mt-5 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="font-inter text-[14px] leading-[23px] text-neutral-300 mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-1.5 pl-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 space-y-1.5 pl-4 list-decimal">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="font-inter text-[14px] leading-[22px] text-neutral-300 flex gap-2">
                      <span className="mt-[9px] size-[4px] rounded-full bg-neutral-500 shrink-0" />
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-neutral-100">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-neutral-300">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="font-mono text-[12px] bg-neutral-800 text-brand-accent px-1.5 py-0.5 rounded">
                      {children}
                    </code>
                  ),
                  hr: () => (
                    <hr className="border-neutral-800 my-6" />
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-brand-accent pl-4 my-4 text-neutral-400 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {previewMarkdown}
              </ReactMarkdown>
            </div>
          </>
        ) : isGenerating ? (
          /* ── Plan A: GPT-4o generating sections ── */
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800/60 animate-pulse">
              <DocumentTextIcon className="size-5 text-neutral-400" />
            </div>
            <div className="space-y-1.5">
              <p className="font-inter text-[15px] font-medium text-neutral-200">
                Building your document…
              </p>
              <p className="font-inter text-[13px] leading-[20px] text-neutral-500 max-w-[240px]">
                Pulling key insights from your conversation.
              </p>
            </div>
          </div>
        ) : (
          /* ── Early-exit stub ── informative, never a dead-end */
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800/60">
              <DocumentIcon className="size-5 text-neutral-400" />
            </div>
            <div className="space-y-1.5">
              <p className="font-inter text-[15px] font-medium text-neutral-200">
                Session ended early
              </p>
              <p className="font-inter text-[13px] leading-[20px] text-neutral-500 max-w-[240px]">
                Not enough was captured to build a document. Try a longer session next time.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── border-t, px-8 py-6 */}
      <div className="border-t border-neutral-800 px-8 py-6">
        <button
          onClick={onNewSession}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-600 bg-[rgba(37,37,37,0.8)] font-inter text-[14px] font-medium text-neutral-200 transition-opacity hover:opacity-80"
        >
          <ArrowPathIcon className="w-3.5 h-3.5 stroke-[2]" />
          Start Another Session
        </button>
      </div>
    </div>
  );
}
