import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { WoundPhoto } from '../lib/supabase';

export function useWoundPhotos() {
  const [photos, setPhotos] = useState<WoundPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wound_photos')
        .select('*')
        .order('photo_date', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching photos');
    } finally {
      setLoading(false);
    }
  };

  const createPhoto = async (photoData: Omit<WoundPhoto, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wound_photos')
        .insert([{ ...photoData, professional_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setPhotos(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error creating photo';
      return { data: null, error };
    }
  };

  const updatePhoto = async (id: string, updates: Partial<WoundPhoto>) => {
    try {
      const { data, error } = await supabase
        .from('wound_photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPhotos(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error updating photo';
      return { data: null, error };
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wound_photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPhotos(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error deleting photo';
      return { error };
    }
  };

  const uploadPhoto = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `wound-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error uploading photo';
      return { url: null, error };
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return {
    photos,
    loading,
    error,
    createPhoto,
    updatePhoto,
    deletePhoto,
    uploadPhoto,
    refetch: fetchPhotos,
  };
}