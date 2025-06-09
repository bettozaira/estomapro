/*
  # Create clinical evolutions table

  1. New Tables
    - `clinical_evolutions`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `professional_id` (uuid, foreign key)
      - `evolution_date` (date)
      - `evolution_time` (time)
      - `clinical_description` (text)
      - `procedures` (text)
      - `observations` (text)
      - `wound_assessment` (jsonb)
      - `digital_signature` (text)
      - `location_coordinates` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `clinical_evolutions` table
    - Add policy for professionals to manage evolutions for their patients
*/

CREATE TABLE IF NOT EXISTS clinical_evolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  evolution_date date NOT NULL,
  evolution_time time NOT NULL,
  clinical_description text NOT NULL,
  procedures text DEFAULT '',
  observations text DEFAULT '',
  wound_assessment jsonb DEFAULT '{"odor": false, "exudate": false, "edges": false, "depth": false}',
  digital_signature text,
  location_coordinates text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clinical_evolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage evolutions for their patients"
  ON clinical_evolutions
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid());

CREATE TRIGGER update_clinical_evolutions_updated_at
  BEFORE UPDATE ON clinical_evolutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();