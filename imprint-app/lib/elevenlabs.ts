'use client';
import { Conversation } from '@11labs/client';

export interface ElevenLabsConfig {
  agentKey?: string; // 'strategist' | 'creative' | 'guide'
  moduleKey?: string; // 'positioning' | 'voice-tone' | 'persona' | 'vision-values'
  systemPrompt: string;
  onMessage: (message: { message: string; source: string }) => void;
  onModeChange: (mode: { mode: string }) => void;
  onStatusChange: (status: { status: string }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (message: string, context?: any) => void;
}

export async function startConversation(config: ElevenLabsConfig) {
  const agent = config.agentKey || 'strategist';
  const moduleParam = config.moduleKey ? `&module=${encodeURIComponent(config.moduleKey)}` : '';
  const res = await fetch(`/api/elevenlabs/signed-url?agent=${agent}${moduleParam}`);
  const data = await res.json();

  if (!data.signedUrl) {
    throw new Error('Failed to get signed URL');
  }

  // Note: system prompts are baked into each agent — no overrides needed
  const conversation = await Conversation.startSession({
    signedUrl: data.signedUrl,
    onMessage: config.onMessage,
    onModeChange: config.onModeChange,
    onStatusChange: config.onStatusChange,
    onError: config.onError,
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
