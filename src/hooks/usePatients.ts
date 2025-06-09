import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Patient } from '../lib/supabase';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching patients');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('patients')
        .insert([{ ...patientData, professional_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setPatients(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error creating patient';
      return { data: null, error };
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPatients(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error updating patient';
      return { data: null, error };
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPatients(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error deleting patient';
      return { error };
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    refetch: fetchPatients,
  };
}