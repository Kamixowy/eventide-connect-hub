
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

    // Create a new conversation using the stored procedure
    const { data: conversation, error: conversationError } = await supabase.rpc(
      'create_conversation_and_participants',
      { 
        user_one: user.id,
        user_two: organizationUserId 
      }
    );

    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      throw conversationError;
    }

    if (!conversation || !conversation[0]) {
      console.error('Failed to create conversation');
      return null;
    }

    // Extract the conversation ID from the result
    const conversationId = conversation[0].conversation_id;
    console.log('Created conversation with ID:', conversationId);
    
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
