
import { supabase } from '@/lib/supabase';

export const updateEventStatus = async (eventId: string, newStatus: string) => {
  const { error } = await supabase
    .from('events')
    .update({ status: newStatus })
    .eq('id', eventId);
    
  if (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
  
  return true;
};
