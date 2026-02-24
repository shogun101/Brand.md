import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import SessionDetailClient from './SessionDetailClient'

export default async function SessionDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const supabase = createServiceClient()
  const { data: session } = await supabase
    .from('sessions')
    .select('id, brand_name, module, agent, duration_seconds, created_at, document, kit_data')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (!session) notFound()

  return <SessionDetailClient session={session} />
}
