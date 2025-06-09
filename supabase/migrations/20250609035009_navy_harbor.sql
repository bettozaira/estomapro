/*
  # Create quick consultations table

  1. New Tables
    - `quick_consultations`
      - `id` (uuid, primary key)
      - `professional_id` (uuid, foreign key)
      - `patient_name` (text)
      - `procedure` (text)
      - `observation` (text)
      - `consultation_datetime` (timestamp)
      - `location_coordinates` (text)
      - `photo_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quick_consultations` table
    - Add policy for professionals to manage their quick consultations
*/

CREATE TABLE IF NOT EXISTS quick_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  procedure text NOT NULL,
  observation text DEFAULT '',
  consultation_datetime timestamptz NOT NULL,
  location_coordinates text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quick_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their quick consultations"
  ON quick_consultations
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid());