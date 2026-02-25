import { NextResponse } from 'next/server';
import { Webhook } from 'standardwebhooks';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!webhookKey) {
    console.error('[Webhook] DODO_PAYMENTS_WEBHOOK_KEY not set');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  // Verify signature
  try {
    const wh = new Webhook(webhookKey);
    wh.verify(body, headers);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(body) as {
      type?: string;
      data?: { metadata?: Record<string, string> };
    };

    if (payload.type === 'payment.succeeded') {
      const userId = payload.data?.metadata?.userId;

      if (!userId) {
        console.error('[Webhook] No userId in metadata');
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const supabase = createServiceClient();
      const { error } = await supabase
        .from('user_credits')
        .upsert(
          { user_id: userId, credits: 5, max_credits: 5, is_free_trial: false },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('[Webhook] Supabase error:', error);
        return NextResponse.json({ error: 'DB error' }, { status: 500 });
      }

      console.log(`[Webhook] ✅ Added 5 credits for user ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Parse error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
