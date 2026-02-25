import { NextResponse } from 'next/server';

/**
 * GET /api/checkout/success
 *
 * Redirect target after Dodo Payments checkout.
 * Real crediting happens via webhook (onPaymentSucceeded).
 * This just updates the client UI optimistically.
 */
export async function GET(request: Request) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://imprint-app-shogun.vercel.app';
  return NextResponse.redirect(new URL('/?credits_added=5', APP_URL));
}
