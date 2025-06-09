import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Professional {
  id: string;
  full_name: string;
  registration_number: string;
  specialty?: string;
  institution?: string;
  email: string;
  phone?: string;
  photo_url?: string;
  digital_signature?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  professional_id: string;
  full_name: string;
  birth_date: string;
  gender: 'masculino' | 'feminino' | 'outro';
  phone?: string;
  email?: string;
  main_diagnosis: string;
  observations?: string;
  responsible_name?: string;
  responsible_phone?: string;
  password_protected: boolean;
  password_hash?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ClinicalEvolution {
  id: string;
  patient_id: string;
  professional_id: string;
  evolution_date: string;
  evolution_time: string;
  clinical_description: string;
  procedures?: string;
  observations?: string;
  wound_assessment: {
    odor: boolean;
    exudate: boolean;
    edges: boolean;
    depth: boolean;
  };
  digital_signature?: string;
  location_coordinates?: string;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  evolution_id: string;
  name: string;
  quantity: string;
  batch?: string;
  created_at: string;
}

export interface WoundPhoto {
  id: string;
  patient_id: string;
  professional_id: string;
  photo_url: string;
  photo_date: string;
  wound_type?: string;
  wound_stage?: string;
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface QuickConsultation {
  id: string;
  professional_id: string;
  patient_name: string;
  procedure: string;
  observation?: string;
  consultation_datetime: string;
  location_coordinates?: string;
  photo_url?: string;
  created_at: string;
}

export interface EvolutionTemplate {
  id: string;
  professional_id: string;
  name: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}