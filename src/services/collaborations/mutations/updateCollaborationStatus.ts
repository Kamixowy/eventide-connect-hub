
import { supabase } from '@/lib/supabase';
import { COLLABORATION_STATUSES } from '../utils';

/**
 * Updates collaboration status
 * 
 * @param id - Collaboration ID
 * @param status - New status
 * @returns Promise with updated collaboration
 */
export const updateCollaborationStatus = async (id: string, status: string) => {
  try {
    // Validate that the status is one of the allowed values
    if (!Object.values(COLLABORATION_STATUSES).includes(status)) {
      throw new Error(`Invalid status value: ${status}`);
    }
    
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
