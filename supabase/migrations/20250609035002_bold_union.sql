/*
  # Create materials table

  1. New Tables
    - `materials`
      - `id` (uuid, primary key)
      - `evolution_id` (uuid, foreign key)
      - `name` (text)
      - `quantity` (text)
      - `batch` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `materials` table
    - Add policy for professionals to manage materials for their evolutions
*/

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evolution_id uuid REFERENCES clinical_evolutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity text NOT NULL,
  batch text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage materials for their evolutions"
  ON materials
  FOR ALL
  TO authenticated
  USING (
    evolution_id IN (
      SELECT id FROM clinical_evolutions WHERE professional_id = auth.uid()
    )
  );