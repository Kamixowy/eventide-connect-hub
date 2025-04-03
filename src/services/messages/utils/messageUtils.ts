
import { supabase } from '@/integrations/supabase/client';

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
