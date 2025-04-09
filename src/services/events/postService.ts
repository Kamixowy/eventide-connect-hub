
import { supabase } from '@/lib/supabase';

export const addEventPost = async (eventId: string, title: string, content: string) => {
  const { data, error } = await supabase
    .from('event_posts')
    .insert([
      { event_id: eventId, title, content }
    ])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding event post:', error);
    throw error;
  }
  
  return data;
};

export const deleteEventPost = async (postId: string) => {
  const { error } = await supabase
    .from('event_posts')
    .delete()
    .eq('id', postId);
    
  if (error) {
    console.error('Error deleting event post:', error);
    throw error;
  }
  
  return true;
};
