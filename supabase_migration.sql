-- Supabase SQL Migration for HireAssist
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)

-- Users table (synced from Clerk via webhook)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Resume analysis history
CREATE TABLE IF NOT EXISTS resume_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  analysis JSONB NOT NULL,
  jobs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups by clerk_id
CREATE INDEX IF NOT EXISTS idx_resume_history_clerk_id ON resume_history(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-runs)
DROP POLICY IF EXISTS "Allow insert users" ON users;
DROP POLICY IF EXISTS "Allow read own user" ON users;
DROP POLICY IF EXISTS "Allow insert resume_history" ON resume_history;
DROP POLICY IF EXISTS "Allow read resume_history" ON resume_history;

-- Allow inserts from anon/service role (for webhook and frontend)
CREATE POLICY "Allow insert users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read own user" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow insert resume_history" ON resume_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read resume_history" ON resume_history
  FOR SELECT USING (true);
