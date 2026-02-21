import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || apiKey === 'PLACEHOLDER' || !agentId || agentId === 'PLACEHOLDER') {
    return NextResponse.json(
      { error: 'ElevenLabs not configured', signedUrl: null },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: { 'xi-api-key': apiKey },
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, signedUrl: null }, { status: 500 });
  }
}
