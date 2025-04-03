
import { supabase } from '@/integrations/supabase/client';

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
    const existingConversationId = await checkExistingConversation(user.id, organizationUserId);
    
    if (existingConversationId) {
      // Send the initial message to the existing conversation
      if (initialMessage.trim()) {
        // Import locally to avoid circular dependencies
        const { sendMessage } = await import('../messagesService');
        await sendMessage(existingConversationId, initialMessage);
        console.log('Sent message to existing conversation');
      }
      
      return { conversationId: existingConversationId };
    }

    // Create a new conversation
    const conversationId = await createNewConversation(user.id, organizationUserId);
    
    // Send the initial message
    if (initialMessage.trim() && conversationId) {
      console.log('Sending initial message');
      
      // Import locally to avoid circular dependencies
      const { sendMessage } = await import('../messagesService');
      const messageResult = await sendMessage(conversationId, initialMessage);
      
      if (!messageResult) {
        console.error('Failed to send initial message');
      } else {
        console.log('Initial message sent successfully');
      }
    }

    return conversationId ? { conversationId } : null;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error; // Re-throw to allow better error handling in the UI
  }
};

// Helper function to check if a conversation already exists between two users
const checkExistingConversation = async (userId: string, otherUserId: string): Promise<string | null> => {
  try {
    const { data: existingParticipants, error: existingError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);
      
    if (existingError) {
      console.error('Error checking existing conversations:', existingError);
      throw existingError;
    }
    
    if (existingParticipants && existingParticipants.length > 0) {
      const conversationIds = existingParticipants.map(p => p.conversation_id);
      
      const { data: otherParticipants, error: otherError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', otherUserId)
        .in('conversation_id', conversationIds);
        
      if (otherError) {
        console.error('Error checking other participants:', otherError);
        throw otherError;
      }
      
      if (otherParticipants && otherParticipants.length > 0) {
        // A conversation already exists between these users
        const existingConversationId = otherParticipants[0].conversation_id;
        console.log('Found existing conversation:', existingConversationId);
        return existingConversationId;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error checking existing conversation:', error);
    return null;
  }
};

// Helper function to create a new conversation between two users
const createNewConversation = async (userId: string, otherUserId: string): Promise<string | null> => {
  try {
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
        user_id: userId,
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
        user_id: otherUserId,
      });

    if (orgParticipantError) {
      console.error('Error adding organization as participant:', orgParticipantError);
      throw orgParticipantError;
    }

    console.log('Added organization as participant');
    
    return conversation.id;
  } catch (error) {
    console.error('Error creating new conversation:', error);
    return null;
  }
};
