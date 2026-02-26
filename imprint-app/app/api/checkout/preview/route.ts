import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const PRODUCT_ID = 'pdt_0NZFoV3kqgsjODi1gjf4G';

export async function POST(req: Request) {
  let discount_code: string | undefined;
  try {
    const body = await req.json();
    if (body?.discount_code) discount_code = String(body.discount_code);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!discount_code) {
    return NextResponse.json({ error: 'discount_code required' }, { status: 400 });
  }

  const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT ?? 'live_mode') as 'live_mode' | 'test_mode',
  });

  try {
    const preview = await dodo.checkoutSessions.preview({
      product_cart: [{ product_id: PRODUCT_ID, quantity: 1 }],
      discount_code,
      billing_address: { country: 'US' },
    });

    // total_price is in cents — convert to display string
    const dollars = (preview.total_price / 100).toFixed(0);
    const displayPrice = `$${dollars}`;

    console.log('[Preview] discount_code:', discount_code, '| total_price:', preview.total_price, '| display:', displayPrice);

    return NextResponse.json({ displayPrice, totalCents: preview.total_price });
  } catch (err) {
    console.error('[Preview] Dodo preview error:', err);
    return NextResponse.json({ error: 'Preview unavailable' }, { status: 502 });
  }
}
