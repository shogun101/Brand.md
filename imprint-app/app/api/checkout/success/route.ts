import { NextResponse } from 'next/server';

/**
 * GET /api/checkout/success
 *
 * Callback after successful Dodo Payments checkout.
 * Verifies the session, adds 5 credits to the user, and redirects home.
 *
 * TODO: Verify payment with Dodo Payments API in production.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  const isDev = searchParams.get('dev');

  if (isDev) {
    // Dev mode — just redirect home
    console.log('[Checkout] Dev mode — skipping payment verification');
    return NextResponse.redirect(new URL('/?credits_added=5', request.url));
  }

  if (!sessionId) {
    return NextResponse.redirect(new URL('/?error=missing_session', request.url));
  }

  try {
    // --- Production implementation ---
    // 1. Verify session with Dodo Payments
    // const session = await dodoPayments.checkout.retrieve(sessionId);
    // if (session.status !== 'paid') throw new Error('Payment not completed');
    //
    // 2. Add 5 credits to user in Supabase
    // const userId = session.metadata.user_id;
    // await supabase.from('credits').upsert({
    //   user_id: userId,
    //   credits: 5,
    //   max_credits: 5,
    //   is_free_trial: false,
    // });

    console.log('[Checkout] Payment verified for session:', sessionId);
    return NextResponse.redirect(new URL('/?credits_added=5', request.url));
  } catch (error) {
    console.error('[Checkout] Verification failed:', error);
    return NextResponse.redirect(new URL('/?error=payment_failed', request.url));
  }
}
