import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { brandName, module, agent, durationSeconds, transcript, sections, kitData } = body

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      brand_name: brandName || 'Untitled',
      module,
      agent,
      status: 'completed',
      duration_seconds: durationSeconds || 0,
      transcript,
      document: sections,
      kit_data: kitData,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[sessions/save]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
