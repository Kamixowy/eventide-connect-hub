
import { supabase } from '@/integrations/supabase/client';

// Function to check if a user is a participant in a conversation
export const checkConversationParticipation = async (
  conversationId: string, 
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Checking if user ${userId} is a participant in conversation ${conversationId}`);
    
    const { data, error } = await supabase
      .from('conversation_participants')
      .select()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking conversation participation:', error);
      return false;
    }
    
    const isParticipant = !!data;
    console.log(`User ${userId} is${isParticipant ? '' : ' not'} a participant in conversation ${conversationId}`);
    
    return isParticipant;
  } catch (error) {
    console.error('Exception checking conversation participation:', error);
    return false;
  }
};
