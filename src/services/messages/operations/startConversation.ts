
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
    console.log('Checking if conversation already exists');
    const { data: existingConversation, error: existingConvError } = await supabase
      .rpc('find_conversation_between_users', { 
        user_one: user.id, 
        user_two: organizationUserId 
      });
    
    let conversationId;
    
    if (existingConvError) {
      console.error('Error checking existing conversation:', existingConvError);
      // Continue with creating a new conversation
    } else if (existingConversation && existingConversation.length > 0) {
      // If conversation exists, use that
      console.log('Found existing conversation:', existingConversation[0]);
      conversationId = existingConversation[0];
    }
    
    // If no existing conversation was found, create a new one
    if (!conversationId) {
      console.log('No existing conversation found, creating new one');
      
      // Create a new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('direct_conversations')
        .insert({})
        .select()
        .single();

      if (conversationError || !newConversation) {
        console.error('Error creating conversation:', conversationError);
        throw new Error('Failed to create conversation');
      }
      
      conversationId = newConversation.id;
      console.log('Created conversation with ID:', conversationId);
      
      // Add both users as participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversationId, user_id: user.id },
          { conversation_id: conversationId, user_id: organizationUserId }
        ]);
        
      if (participantsError) {
        console.error('Error adding conversation participants:', participantsError);
        throw new Error('Failed to add participants to conversation');
      }
      
      console.log('Added participants to conversation');
    }
    
    // Send the initial message
    if (initialMessage.trim() && conversationId) {
      console.log('Sending initial message to conversation:', conversationId);
      
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
