-- Rental applications with blockchain proof
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  wallet VARCHAR(255) NOT NULL,
  listing TEXT NOT NULL,
  message TEXT,
  tx_hash VARCHAR(128) NOT NULL,
  signature_base64 TEXT,
  payload_json TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
