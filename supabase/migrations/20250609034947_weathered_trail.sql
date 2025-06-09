/*
  # Create professionals table

  1. New Tables
    - `professionals`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `registration_number` (text, unique)
      - `specialty` (text)
      - `institution` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `photo_url` (text)
      - `digital_signature` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `professionals` table
    - Add policy for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  specialty text,
  institution text,
  email text UNIQUE NOT NULL,
  phone text,
  photo_url text,
  digital_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own professional data"
  ON professionals
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();