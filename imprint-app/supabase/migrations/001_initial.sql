-- Sessions table
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  brand_name text,
  module text not null, -- 'positioning' | 'voice-tone' | 'persona' | 'vision-values'
  agent text not null,  -- 'strategist' | 'creative' | 'coach'
  status text default 'active', -- 'active' | 'completed' | 'paused'
  duration_seconds integer default 0,
  transcript jsonb default '[]',
  document jsonb default '{}', -- structured sections from the session
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table sessions enable row level security;
create policy "Users can manage own sessions"
  on sessions for all using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table sessions;
