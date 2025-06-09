import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Professional } from '../lib/supabase';

export function useProfessional() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessional = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfessional(null);
        return;
      }

      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfessional(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching professional');
    } finally {
      setLoading(false);
    }
  };

  const createProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('professionals')
        .insert([{ ...professionalData, id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setProfessional(data);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error creating professional';
      return { data: null, error };
    }
  };

  const updateProfessional = async (updates: Partial<Professional>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfessional(data);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error updating professional';
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchProfessional();
  }, []);

  return {
    professional,
    loading,
    error,
    createProfessional,
    updateProfessional,
    refetch: fetchProfessional,
  };
}