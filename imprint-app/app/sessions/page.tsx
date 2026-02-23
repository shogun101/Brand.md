import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import SessionsClient from './SessionsClient'

export default async function SessionsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const supabase = createServiceClient()
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, brand_name, module, agent, duration_seconds, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return <SessionsClient sessions={sessions ?? []} />
}
