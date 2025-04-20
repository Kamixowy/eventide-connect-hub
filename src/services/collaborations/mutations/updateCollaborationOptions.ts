
import { supabase } from '@/lib/supabase';
import { CollaborationOption, CollaborationStatus } from '../types';

/**
 * Updates collaboration options and total amount
 * 
 * @param id - Collaboration ID
 * @param options - Updated options array
 * @param totalAmount - Updated total amount
 * @returns Promise with updated collaboration
 */
export const updateCollaborationOptions = async (
  id: string, 
  options: CollaborationOption[], 
  totalAmount: number
) => {
  try {
    // Start a transaction
    // First, update the collaboration total amount
    const { error: updateError } = await supabase
      .from('collaborations')
      .update({ 
        total_amount: totalAmount,
        status: 'negotiation' as CollaborationStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating collaboration:', updateError);
      throw updateError;
    }

    // Delete existing options
    const { error: deleteError } = await supabase
      .from('collaboration_options')
      .delete()
      .eq('collaboration_id', id);

    if (deleteError) {
      console.error('Error deleting collaboration options:', deleteError);
      throw deleteError;
    }

    // Insert new options
    const optionsToInsert = options.map(option => ({
      ...option,
      collaboration_id: id
    }));

    const { error: insertError } = await supabase
      .from('collaboration_options')
      .insert(optionsToInsert);

    if (insertError) {
      console.error('Error inserting collaboration options:', insertError);
      throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update collaboration options:', error);
    throw error;
  }
};
