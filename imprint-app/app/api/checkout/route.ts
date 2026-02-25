import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const PRODUCT_ID = 'pdt_0NZFoV3kqgsjODi1gjf4G';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://imprint-app-shogun.vercel.app';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '';
  const name = user?.fullName ?? '';

  const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT ?? 'live_mode') as 'live_mode' | 'test_mode',
  });

  try {
    const payment = await dodo.payments.create({
      billing: {
        city: 'N/A',
        country: 'US',
        state: 'N/A',
        street: 'N/A',
        zipcode: '00000',
      },
      customer: { email, name },
      metadata: { userId },
      payment_link: true,
      product_cart: [{ product_id: PRODUCT_ID, quantity: 1 }],
      return_url: `${APP_URL}/api/checkout/success`,
    });

    return NextResponse.json({ checkout_url: payment.payment_link });
  } catch (err) {
    console.error('[Checkout] Dodo Payments error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
