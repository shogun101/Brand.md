import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

/**
 * POST /api/webhook/dodo-payments
 * Handles Dodo Payments webhook events.
 * TODO: Add signature verification with DODO_PAYMENTS_WEBHOOK_KEY once set.
 */
export async function POST(request: Request) {
  try {
    // TODO: verify webhook signature
    // const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    // verify(request, webhookKey) ...

    const payload = await request.json() as {
      type?: string;
      data?: {
        metadata?: Record<string, string>;
        status?: string;
      };
    };

    if (payload.type === 'payment.succeeded') {
      const userId = payload.data?.metadata?.userId;

      if (!userId) {
        console.error('[Webhook] No userId in payment metadata');
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

      console.log(`[Webhook] Added 5 credits for user ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
