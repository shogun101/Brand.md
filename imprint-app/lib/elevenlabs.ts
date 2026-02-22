'use client';
import { Conversation } from '@11labs/client';
import { MODULE_PROMPTS } from '@/lib/prompts/modules';
import { strategistPrompt } from '@/lib/prompts/strategist';
import { creativePrompt } from '@/lib/prompts/creative';
import { coachPrompt } from '@/lib/prompts/coach';

const AGENT_BASE_PROMPTS: Record<string, string> = {
  strategist: strategistPrompt,
  creative:   creativePrompt,
  guide:      coachPrompt,
};

export interface ElevenLabsConfig {
  agentKey?: string;   // 'strategist' | 'creative' | 'guide'
  moduleKey?: string;  // 'positioning' | 'voice-tone' | 'persona' | 'vision-values'
  systemPrompt: string;
  onMessage: (message: { message: string; source: string }) => void;
  onModeChange: (mode: { mode: string }) => void;
  onStatusChange: (status: { status: string }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (message: string, context?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDebug?: (event: any) => void;
}

export async function startConversation(config: ElevenLabsConfig) {
  const agent = config.agentKey || 'strategist';
  const res = await fetch(`/api/elevenlabs/signed-url?agent=${agent}`);
  const data = await res.json();

  if (!data.signedUrl) {
    throw new Error('Failed to get signed URL');
  }

  // Build override: agent base prompt + module question flow
  const basePrompt = AGENT_BASE_PROMPTS[agent] || strategistPrompt;
  const modulePrompt = config.moduleKey ? MODULE_PROMPTS[config.moduleKey] : undefined;
  const fullPrompt = modulePrompt
    ? `${basePrompt}\n\n${modulePrompt}`
    : basePrompt;

  const conversation = await Conversation.startSession({
    signedUrl: data.signedUrl,
    overrides: {
      agent: {
        prompt: { prompt: fullPrompt },
      },
    },
    onMessage: config.onMessage,
    onModeChange: config.onModeChange,
    onStatusChange: config.onStatusChange,
    onError: config.onError,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDebug: config.onDebug ?? ((_e: any) => {}),
  });

  return conversation;
}

export function parseSectionUpdates(text: string): Array<{
  section: string;
  title: string;
  content: string;
}> {
  const updates: Array<{ section: string; title: string; content: string }> = [];
  const regex = /<section_update>([\s\S]*?)<\/section_update>/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      updates.push(parsed);
    } catch {
      // ignore malformed blocks
    }
  }

  return updates;
}
