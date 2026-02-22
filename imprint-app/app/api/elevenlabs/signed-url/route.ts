import { NextResponse } from 'next/server';
import { strategistPrompt } from '@/lib/prompts/strategist';
import { creativePrompt } from '@/lib/prompts/creative';
import { coachPrompt } from '@/lib/prompts/coach';
import { MODULE_PROMPTS } from '@/lib/prompts/modules';

const AGENT_MAP: Record<string, string | undefined> = {
  strategist: process.env.ELEVENLABS_AGENT_STRATEGIST,
  creative:   process.env.ELEVENLABS_AGENT_CREATIVE,
  guide:      process.env.ELEVENLABS_AGENT_GUIDE,
};

const AGENT_PROMPTS: Record<string, string> = {
  strategist: strategistPrompt,
  creative:   creativePrompt,
  guide:      coachPrompt,
};

export async function GET(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER') {
    return NextResponse.json({ error: 'ElevenLabs not configured', signedUrl: null }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const agentKey = searchParams.get('agent') || 'strategist';
  const moduleKey = searchParams.get('module') || '';

  const agentId = AGENT_MAP[agentKey] || process.env.ELEVENLABS_AGENT_ID;

  if (!agentId || agentId === 'PLACEHOLDER') {
    return NextResponse.json({ error: 'Agent not configured', signedUrl: null }, { status: 503 });
  }

  const agentPrompt = AGENT_PROMPTS[agentKey] || strategistPrompt;
  const modulePrompt = moduleKey ? MODULE_PROMPTS[moduleKey] : undefined;

  // Build override body — inject module prompt at signed URL request time
  const body = modulePrompt
    ? {
        conversation_config_override: {
          agent: {
            prompt: {
              prompt: agentPrompt + '\n\n' + modulePrompt,
            },
          },
        },
      }
    : {};

  try {
    // Use the agent link endpoint which supports overrides in the POST body
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}/link`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      // Fallback: try legacy GET signed URL endpoint (no override support)
      const fallback = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        { headers: { 'xi-api-key': apiKey } }
      );
      if (!fallback.ok) throw new Error(`ElevenLabs API error: ${response.status}`);
      const fallbackData = await fallback.json();
      return NextResponse.json({ signedUrl: fallbackData.signed_url });
    }

    const data = await response.json();
    // The link endpoint returns { signed_url: "..." }
    const signedUrl = data.signed_url || data.signedUrl;
    if (!signedUrl) throw new Error('No signed URL in response');

    return NextResponse.json({ signedUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, signedUrl: null }, { status: 500 });
  }
}
