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

const MODULE_FIRST_MESSAGES: Record<string, string> = {
  'positioning':   "Brand Positioning — what are you building? More you share, the better. End this whenever you want.",
  'voice-tone':    "Voice and Tone — how does your brand sound, or how do you want it to? More you share, the better. End this whenever.",
  'persona':       "Brand Persona — who are you building for? More you share, the better. End this whenever.",
  'vision-values': "Vision and Values — picture your brand as a person: how they look, how they carry themselves, how they talk. Where are they taking things? More you share, the better. End this whenever.",
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

  const moduleKey = config.moduleKey || 'positioning';
  const firstMessage = MODULE_FIRST_MESSAGES[moduleKey] ?? MODULE_FIRST_MESSAGES['positioning'];

  const conversation = await Conversation.startSession({
    signedUrl: data.signedUrl,
    overrides: {
      agent: {
        prompt: { prompt: fullPrompt },
        firstMessage: firstMessage,
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
