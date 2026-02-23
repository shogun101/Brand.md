-- Switch user_id from UUID (Supabase auth) to TEXT (Clerk user IDs)
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE sessions ALTER COLUMN user_id TYPE text USING user_id::text;

-- Add kit_data column if it doesn't exist
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS kit_data jsonb DEFAULT '{}';

-- Drop old Supabase auth RLS policy (security now handled server-side via Clerk)
DROP POLICY IF EXISTS "Users can manage own sessions" ON sessions;

-- Disable RLS (server-side auth handles security)
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
