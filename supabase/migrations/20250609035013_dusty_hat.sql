/*
  # Create evolution templates table

  1. New Tables
    - `evolution_templates`
      - `id` (uuid, primary key)
      - `professional_id` (uuid, foreign key)
      - `name` (text)
      - `content` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `evolution_templates` table
    - Add policy for professionals to manage their templates
*/

CREATE TABLE IF NOT EXISTS evolution_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'Geral',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can manage their evolution templates"
  ON evolution_templates
  FOR ALL
  TO authenticated
  USING (professional_id = auth.uid());

CREATE TRIGGER update_evolution_templates_updated_at
  BEFORE UPDATE ON evolution_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();