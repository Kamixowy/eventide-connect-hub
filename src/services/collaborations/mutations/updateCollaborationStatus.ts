
import { supabase } from '@/lib/supabase';
import { CollaborationStatus } from '../types';

/**
 * Updates collaboration status
 * 
 * @param id - Collaboration ID
 * @param status - New status
 * @returns Promise with updated collaboration
 */
export const updateCollaborationStatus = async (id: string, status: CollaborationStatus) => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating collaboration status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update collaboration status:', error);
    throw error;
  }
};
