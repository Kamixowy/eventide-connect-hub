
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '../types';
import { enhanceParticipantsWithProfiles, getLastMessage, getUnreadCount } from '../utils/conversationUtils';

// Function to fetch all conversations for the current user
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching conversations for user:', user.id);

    // Get all conversations the user is part of
    const { data: participantsData, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      throw participantsError;
    }
    
    if (!participantsData || !participantsData.length) {
      console.log('No conversations found for user');
      return [];
    }

    const conversationIds = participantsData.map(p => p.conversation_id);
    console.log('Found conversation IDs:', conversationIds);

    // Get conversations with their participants
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select(`
        *,
        participants:conversation_participants(
          id, 
          user_id
        )
      `)
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      throw conversationsError;
    }

    console.log('Fetched conversations:', conversations.length);

    // For each conversation, fetch the participants' profiles and organizations
    const conversationsWithProfiles = await Promise.all(
      conversations.map(async (conversation) => {
        // Enhance participants with profile and organization data
        const enhancedParticipants = await enhanceParticipantsWithProfiles(
          conversation.participants, 
          supabase
        );

        // Get the last message for this conversation
        const lastMessage = await getLastMessage(conversation.id, supabase);

        // Get unread count
        const unreadCount = await getUnreadCount(conversation.id, user.id, supabase);

        return {
          ...conversation,
          participants: enhancedParticipants,
          lastMessage,
          unreadCount,
        } as Conversation;
      })
    );

    return conversationsWithProfiles;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};
