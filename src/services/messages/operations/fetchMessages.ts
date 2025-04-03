
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';

/**
 * Fetch messages for a specific conversation
 */
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching messages for conversation:', conversationId);

    // First mark any unread messages as read
    try {
      await supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });
      console.log('Marked messages as read');
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // Continue execution even if marking messages fails
    }

    // Fetch messages
    const { data: messages, error } = await supabase
      .from('direct_messages')
      .select(`
        *,
        sender:profiles(id, name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    console.log(`Fetched ${messages?.length || 0} messages`);
    return messages || [];
  } catch (error) {
    console.error('Error in fetchMessages:', error);
    throw error;
  }
};
