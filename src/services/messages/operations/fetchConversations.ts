
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '../types';
import { enhanceParticipantsWithProfiles, getLastMessage, getUnreadCount } from '../utils/conversationUtils';

// Function to fetch all conversations for the current user
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching conversations for user:', user.id);

    // Direct approach using direct_conversations and conversation_participants
    try {
      // Get all conversations where the user is a participant
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantsError) {
        console.error('Error fetching conversation participants:', participantsError);
        throw participantsError;
      }

      if (!participantsData || participantsData.length === 0) {
        console.log('No conversations found via participants');
        return [];
      }

      const conversationIds = participantsData.map(p => p.conversation_id);
      console.log('Found conversation IDs via participants:', conversationIds);

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

      console.log('Fetched conversations from participants:', conversations?.length || 0);

      if (!conversations || conversations.length === 0) return [];

      // Enhance conversations with profiles and messages
      return await enhanceConversations(conversations, user.id);
    } catch (participantsError) {
      // If there was an error with the participants approach, try the messages approach
      console.log('Falling back to messages approach due to error:', participantsError.message);
      
      // Alternative approach: Get conversations from messages
      return await fetchConversationsFromMessages(user.id);
    }
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    return [];
  }
};

// Helper function to enhance conversations with profiles and other data
const enhanceConversations = async (conversations: any[], userId: string): Promise<Conversation[]> => {
  return await Promise.all(
    conversations.map(async (conversation) => {
      const enhancedParticipants = await enhanceParticipantsWithProfiles(
        conversation.participants || [], 
        supabase
      );

      const lastMessage = await getLastMessage(conversation.id, supabase);
      const unreadCount = await getUnreadCount(conversation.id, userId, supabase);

      return {
        ...conversation,
        participants: enhancedParticipants,
        lastMessage,
        unreadCount,
      } as Conversation;
    })
  );
};

// Fallback method to fetch conversations through messages
const fetchConversationsFromMessages = async (userId: string): Promise<Conversation[]> => {
  try {
    // First get all sent messages to find conversations
    const { data: sentMessages, error: sentError } = await supabase
      .from('direct_messages')
      .select('conversation_id')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (sentError) {
      console.error('Error fetching sent messages:', sentError);
      throw sentError;
    }

    // Then get all received messages to find conversations
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('direct_messages')
      .select('conversation_id, sender_id')
      .neq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (receivedError) {
      console.error('Error fetching received messages:', receivedError);
      throw receivedError;
    }

    // Combine and get unique conversation IDs
    const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
    if (allMessages.length === 0) {
      console.log('No messages found for user');
      return [];
    }

    const conversationIds = [...new Set(allMessages.map(m => m.conversation_id))];
    console.log('Found conversation IDs from messages:', conversationIds);

    // Get conversations with these IDs
    const { data: conversations, error: conversationsError } = await supabase
      .from('direct_conversations')
      .select('*')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      throw conversationsError;
    }

    console.log('Fetched conversations using messages method:', conversations?.length || 0);
    
    if (!conversations || conversations.length === 0) return [];

    // For each conversation, manually fetch participants since the join might be causing RLS issues
    const enhancedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Get participants for this conversation
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .select('id, user_id')
          .eq('conversation_id', conversation.id);

        if (participantsError) {
          console.error(`Error fetching participants for conversation ${conversation.id}:`, participantsError);
          // Continue with empty participants rather than failing
          conversation.participants = [];
        } else {
          conversation.participants = participants || [];
        }

        // Enhance with profiles, etc.
        const enhancedParticipants = await enhanceParticipantsWithProfiles(
          conversation.participants, 
          supabase
        );

        const lastMessage = await getLastMessage(conversation.id, supabase);
        const unreadCount = await getUnreadCount(conversation.id, userId, supabase);

        return {
          ...conversation,
          participants: enhancedParticipants,
          lastMessage,
          unreadCount,
        } as Conversation;
      })
    );

    return enhancedConversations;
  } catch (error) {
    console.error('Error in fetchConversationsFromMessages:', error);
    return [];
  }
};
