import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ClinicalEvolution, Material } from '../lib/supabase';

export function useEvolutions() {
  const [evolutions, setEvolutions] = useState<ClinicalEvolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvolutions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clinical_evolutions')
        .select('*')
        .order('evolution_date', { ascending: false });

      if (error) throw error;
      setEvolutions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching evolutions');
    } finally {
      setLoading(false);
    }
  };

  const createEvolution = async (
    evolutionData: Omit<ClinicalEvolution, 'id' | 'created_at' | 'updated_at' | 'professional_id'>,
    materials: Omit<Material, 'id' | 'evolution_id' | 'created_at'>[]
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create evolution
      const { data: evolution, error: evolutionError } = await supabase
        .from('clinical_evolutions')
        .insert([{ ...evolutionData, professional_id: user.id }])
        .select()
        .single();

      if (evolutionError) throw evolutionError;

      // Create materials if any
      if (materials.length > 0) {
        const materialsWithEvolutionId = materials.map(material => ({
          ...material,
          evolution_id: evolution.id
        }));

        const { error: materialsError } = await supabase
          .from('materials')
          .insert(materialsWithEvolutionId);

        if (materialsError) throw materialsError;
      }

      setEvolutions(prev => [evolution, ...prev]);
      return { data: evolution, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error creating evolution';
      return { data: null, error };
    }
  };

  const updateEvolution = async (id: string, updates: Partial<ClinicalEvolution>) => {
    try {
      const { data, error } = await supabase
        .from('clinical_evolutions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setEvolutions(prev => prev.map(e => e.id === id ? data : e));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error updating evolution';
      return { data: null, error };
    }
  };

  const deleteEvolution = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clinical_evolutions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvolutions(prev => prev.filter(e => e.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error deleting evolution';
      return { error };
    }
  };

  useEffect(() => {
    fetchEvolutions();
  }, []);

  return {
    evolutions,
    loading,
    error,
    createEvolution,
    updateEvolution,
    deleteEvolution,
    refetch: fetchEvolutions,
  };
}