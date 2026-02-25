import { NextResponse } from 'next/server';

/**
 * POST /api/checkout
 *
 * Creates a checkout session for the Brand Kit ($29).
 * Returns { checkout_url } which the client redirects to.
 *
 * TODO: Wire up to Dodo Payments (or Stripe) in production.
 * For now, returns a placeholder URL.
 *
 * Expected production flow:
 *  1. Authenticate user (Clerk/Supabase)
 *  2. Create Dodo Payments checkout session with:
 *     - product: Brand Kit ($29)
 *     - success_url: /api/checkout/success?session_id={id}
 *     - cancel_url: / (back to app)
 *  3. Return the checkout URL
 */
export async function POST() {
  try {
    // --- Production implementation ---
    // const session = await dodoPayments.checkout.create({
    //   amount: 2900,
    //   currency: 'usd',
    //   product_name: 'Brand Kit',
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    //   metadata: {
    //     user_id: userId,
    //     credits: 5,
    //   },
    // });
    // return NextResponse.json({ checkout_url: session.url });

    // --- Stub for development ---
    console.log('[Checkout] Brand Kit checkout initiated');
    return NextResponse.json({
      checkout_url: '/api/checkout/success?dev=true',
    });
  } catch (error) {
    console.error('[Checkout] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
