/*
  # Create wound photos table

  1. New Tables
    - `wound_photos`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `professional_id` (uuid, foreign key)
      - `photo_url` (text)
      - `photo_date` (date)
      - `wound_type` (text)
      - `wound_stage` (text)
      - `comments` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `wound_photos` table
    - Add policy for professionals to manage photos for their patients
*/

CREATE TABLE IF NOT EXISTS wound_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_date date NOT NULL,
  wound_type text,
  wound_stage text,
  comments text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wound_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage photos for their patients"
  ON wound_photos
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid());

CREATE TRIGGER update_wound_photos_updated_at
  BEFORE UPDATE ON wound_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();