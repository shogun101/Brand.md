import { NextResponse } from 'next/server';

const AGENT_MAP: Record<string, string | undefined> = {
  strategist: process.env.ELEVENLABS_AGENT_STRATEGIST,
  creative:   process.env.ELEVENLABS_AGENT_CREATIVE,
  guide:      process.env.ELEVENLABS_AGENT_GUIDE,
};

// This route just returns a signed URL — overrides are applied
// client-side in Conversation.startSession({ overrides: ... })
export async function GET(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER') {
    return NextResponse.json({ error: 'ElevenLabs not configured', signedUrl: null }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const agentKey = searchParams.get('agent') || 'strategist';
  const agentId = AGENT_MAP[agentKey] || process.env.ELEVENLABS_AGENT_ID;

  if (!agentId || agentId === 'PLACEHOLDER') {
    return NextResponse.json({ error: 'Agent not configured', signedUrl: null }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      { headers: { 'xi-api-key': apiKey } }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    const signedUrl = data.signed_url;
    if (!signedUrl) throw new Error('No signed URL in response');

    return NextResponse.json({ signedUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, signedUrl: null }, { status: 500 });
  }
}
