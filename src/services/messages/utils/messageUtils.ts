
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user is a participant in a conversation
 */
export const checkConversationParticipation = async (conversationId: string, userId: string): Promise<boolean> => {
  try {
    if (!conversationId || !userId) return false;
    
    const { data, error } = await supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking conversation participation:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkConversationParticipation:', error);
    return false;
  }
};

/**
 * Mark messages in a conversation as read
 */
export const markMessagesAsRead = async (conversationId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    await supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
};
