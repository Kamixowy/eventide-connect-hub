
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '../types';
import { enhanceParticipantsWithProfiles, getLastMessage, getUnreadCount } from '../utils/conversationUtils';

// Function to fetch all conversations for the current user
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching conversations for user:', user.id);

    // First approach: Get all conversations the user is part of
    let participantsData;
    let participantsError;
    
    try {
      const result = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      
      participantsData = result.data;
      participantsError = result.error;
    } catch (error) {
      console.error('Exception fetching participants:', error);
      participantsError = error;
    }

    // If there's an RLS error, try an alternative approach
    if (participantsError && participantsError.message?.includes('infinite recursion')) {
      console.log('Working around RLS recursion issue - using direct_messages as fallback');
      
      // Alternative approach: Get conversations from messages the user has sent
      const { data: messagesData, error: messagesError } = await supabase
        .from('direct_messages')
        .select('conversation_id')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        console.error('Error fetching messages for conversation IDs:', messagesError);
        return [];
      }
      
      if (!messagesData || !messagesData.length) {
        console.log('No messages found for user');
        return [];
      }
      
      // Extract unique conversation IDs
      const conversationIds = [...new Set(messagesData.map(m => m.conversation_id))];
      console.log('Found conversation IDs from messages:', conversationIds);
      
      // Get conversations with these IDs
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
        return [];
      }
      
      console.log('Fetched conversations using fallback method:', conversations?.length || 0);
      
      // Process conversations as normal
      if (!conversations || !conversations.length) return [];
      
      const conversationsWithProfiles = await Promise.all(
        conversations.map(async (conversation) => {
          const enhancedParticipants = await enhanceParticipantsWithProfiles(
            conversation.participants || [], 
            supabase
          );

          const lastMessage = await getLastMessage(conversation.id, supabase);
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
    }
    
    // Continue with normal flow if no RLS error
    if (participantsError && !participantsError.message?.includes('infinite recursion')) {
      console.error('Error fetching participants:', participantsError);
      return [];
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
      return [];
    }

    console.log('Fetched conversations:', conversations?.length || 0);

    if (!conversations || !conversations.length) return [];

    // For each conversation, fetch the participants' profiles and organizations
    const conversationsWithProfiles = await Promise.all(
      conversations.map(async (conversation) => {
        // Enhance participants with profile and organization data
        const enhancedParticipants = await enhanceParticipantsWithProfiles(
          conversation.participants || [], 
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
