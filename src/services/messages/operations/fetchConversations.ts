
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/services/messages/types';

/**
 * Fetch all conversations for the current user
 * 
 * UWAGA: Ta funkcjonalność jest tymczasowo wyłączona
 * Wrócimy do niej w przyszłości
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
  // Return empty array until we add the necessary tables
  console.warn('fetchConversations is temporarily disabled');
  return [];
  
  /*
  // This code is temporarily disabled as the tables are not defined in the schema
  try {
    // Fetch conversation IDs where the user is a participant
    const { data: participations, error: participationsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', auth.uid());
    
    if (participationsError) {
      throw participationsError;
    }
    
    if (!participations || participations.length === 0) {
      return [];
    }
    
    const conversationIds = participations.map(p => p.conversation_id);
    
    // Fetch conversations with these IDs
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select(`
        *,
        participants:conversation_participants(
          user_id,
          organization_id,
          profile:profiles(*),
          organization:organizations(*)
        )
      `)
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });
    
    if (conversationsError) {
      throw conversationsError;
    }
    
    // Process unread counts and participant info
    return await Promise.all((conversations || []).map(async conversation => {
      // Get unread count
      const { count: unreadCount } = await supabase
        .from('direct_messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversation.id)
        .neq('sender_id', auth.uid())
        .is('read_at', null);
      
      // Get the latest message
      const { data: lastMessages } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      const lastMessage = lastMessages && lastMessages.length > 0 ? lastMessages[0] : null;
      
      // Format the conversation object
      return {
        ...conversation,
        unreadCount: unreadCount || 0,
        lastMessage
      };
    }));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
  */
};
