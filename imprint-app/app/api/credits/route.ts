import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let { data } = await supabase
    .from('user_credits')
    .select('credits, max_credits, is_free_trial')
    .eq('user_id', userId)
    .single();

  if (!data) {
    const { data: newRow } = await supabase
      .from('user_credits')
      .upsert({ user_id: userId, credits: 1, max_credits: 1, is_free_trial: true })
      .select('credits, max_credits, is_free_trial')
      .single();
    data = newRow;
  }

  return NextResponse.json({
    credits: data?.credits ?? 1,
    maxCredits: data?.max_credits ?? 1,
    isFreeTrial: data?.is_free_trial ?? true,
  });
}
