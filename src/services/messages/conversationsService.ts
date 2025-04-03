
import { supabase } from '@/integrations/supabase/client';
import { Conversation, ConversationParticipant } from './types';

// Helper function to get the other participant in a conversation
export const getRecipient = (conversation: Conversation, currentUserId: string): ConversationParticipant | undefined => {
  return conversation.participants?.find(p => p.user_id !== currentUserId);
};

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
        // For each participant, get their profile and organization details
        const enhancedParticipants = await Promise.all(
          conversation.participants.map(async (participant) => {
            // Get profile for this participant
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, name, avatar_url, user_type, email')
              .eq('id', participant.user_id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }

            // Get organization for this participant (if they are an organization)
            const { data: organization, error: organizationError } = await supabase
              .from('organizations')
              .select('id, name, logo_url, category')
              .eq('user_id', participant.user_id)
              .maybeSingle();

            if (organizationError && organizationError.code !== 'PGRST116') {
              console.error('Error fetching organization:', organizationError);
            }

            // Return enhanced participant
            return {
              id: participant.id,
              conversation_id: conversation.id,
              user_id: participant.user_id,
              profile: profile || undefined,
              organization: organization || undefined
            } as ConversationParticipant;
          })
        );

        // Get the last message for this conversation
        const { data: messages, error: messagesError } = await supabase
          .from('direct_messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (messagesError) {
          console.error('Error fetching last message:', messagesError);
          throw messagesError;
        }

        // Get unread count
        const { data: unreadMessages, error: unreadError } = await supabase
          .from('direct_messages')
          .select('id', { count: 'exact' })
          .eq('conversation_id', conversation.id)
          .eq('read_at', null)
          .neq('sender_id', user.id);

        if (unreadError) {
          console.error('Error fetching unread count:', unreadError);
          throw unreadError;
        }

        return {
          ...conversation,
          participants: enhancedParticipants,
          lastMessage: messages && messages.length > 0 ? messages[0] : null,
          unreadCount: unreadMessages ? unreadMessages.length : 0,
        } as Conversation;
      })
    );

    return conversationsWithProfiles;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

// Function to start a new conversation with an organization
export const startConversation = async (organizationUserId: string, initialMessage: string): Promise<{ conversationId: string } | null> => {
  try {
    console.log('Starting new conversation with organization:', organizationUserId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('Current user ID:', user.id);

    // Check if both users exist
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .in('id', [user.id, organizationUserId]);
      
    if (usersError) {
      console.error('Error checking users:', usersError);
      throw usersError;
    }
    
    if (!users || users.length !== 2) {
      console.error('One or both users do not exist');
      throw new Error('One or both users do not exist');
    }

    // Check if a conversation already exists between these users
    const { data: existingParticipants, error: existingError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);
      
    if (existingError) {
      console.error('Error checking existing conversations:', existingError);
      throw existingError;
    }
    
    if (existingParticipants && existingParticipants.length > 0) {
      const conversationIds = existingParticipants.map(p => p.conversation_id);
      
      const { data: otherParticipants, error: otherError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', organizationUserId)
        .in('conversation_id', conversationIds);
        
      if (otherError) {
        console.error('Error checking other participants:', otherError);
        throw otherError;
      }
      
      if (otherParticipants && otherParticipants.length > 0) {
        // A conversation already exists between these users
        const existingConversationId = otherParticipants[0].conversation_id;
        console.log('Found existing conversation:', existingConversationId);
        
        // Send the initial message to the existing conversation
        if (initialMessage.trim()) {
          // Import locally to avoid circular dependencies
          const { sendMessage } = await import('./messagesService');
          await sendMessage(existingConversationId, initialMessage);
          console.log('Sent message to existing conversation');
        }
        
        return { conversationId: existingConversationId };
      }
    }

    // Create a new conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('direct_conversations')
      .insert({})
      .select()
      .single();

    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      throw conversationError;
    }

    console.log('Created conversation:', conversation.id);

    // Add current user as participant
    const { error: userParticipantError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversation.id,
        user_id: user.id,
      });

    if (userParticipantError) {
      console.error('Error adding user as participant:', userParticipantError);
      throw userParticipantError;
    }

    console.log('Added current user as participant');

    // Add organization as participant
    const { error: orgParticipantError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversation.id,
        user_id: organizationUserId,
      });

    if (orgParticipantError) {
      console.error('Error adding organization as participant:', orgParticipantError);
      throw orgParticipantError;
    }

    console.log('Added organization as participant');

    // Send the initial message
    if (initialMessage.trim()) {
      console.log('Sending initial message');
      
      // Import locally to avoid circular dependencies
      const { sendMessage } = await import('./messagesService');
      const messageResult = await sendMessage(conversation.id, initialMessage);
      
      if (!messageResult) {
        console.error('Failed to send initial message');
      } else {
        console.log('Initial message sent successfully');
      }
    }

    return { conversationId: conversation.id };
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error; // Re-throw to allow better error handling in the UI
  }
};

// Import from messageService to avoid circular dependencies
import { sendMessage } from './messagesService';
