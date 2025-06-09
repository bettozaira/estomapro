/*
  # Create patients table

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `professional_id` (uuid, foreign key)
      - `full_name` (text)
      - `birth_date` (date)
      - `gender` (text)
      - `phone` (text)
      - `email` (text)
      - `main_diagnosis` (text)
      - `observations` (text)
      - `responsible_name` (text)
      - `responsible_phone` (text)
      - `password_protected` (boolean)
      - `password_hash` (text)
      - `photo_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `patients` table
    - Add policy for professionals to manage their patients
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  birth_date date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('masculino', 'feminino', 'outro')),
  phone text,
  email text,
  main_diagnosis text NOT NULL,
  observations text DEFAULT '',
  responsible_name text,
  responsible_phone text,
  password_protected boolean DEFAULT false,
  password_hash text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their patients"
  ON patients
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid());

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();