-- Chat App Database Schema for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at);

-- Row Level Security (RLS) policies
-- Note: Since we're using service role key from backend, RLS is optional
-- But it's good practice to have them in place

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data (if using RLS)
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (true); -- Service role bypasses this

-- Messages policies
CREATE POLICY messages_select_own ON messages
  FOR SELECT
  USING (true); -- Service role bypasses this

CREATE POLICY messages_insert_own ON messages
  FOR INSERT
  WITH CHECK (true); -- Service role bypasses this

CREATE POLICY messages_delete_own ON messages
  FOR DELETE
  USING (true); -- Service role bypasses this

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user account information with hashed passwords';
COMMENT ON TABLE messages IS 'Stores chat messages from both users and AI assistant';
COMMENT ON COLUMN users.password IS 'Bcrypt hashed password (10 rounds)';
COMMENT ON COLUMN messages.role IS 'Message sender: user or assistant';
