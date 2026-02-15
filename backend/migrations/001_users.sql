-- Run this SQL in your Supabase SQL editor if the users table doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('tenant', 'landlord')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
