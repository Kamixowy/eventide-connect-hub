
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

    // Use the create_conversation_and_participants database function to create the conversation
    // This handles finding an existing conversation or creating a new one with participants
    const { data, error } = await supabase.rpc('create_conversation_and_participants', {
      user_one: user.id,
      user_two: organizationUserId
    });
    
    if (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation: ' + error.message);
    }
    
    if (!data || data.length === 0) {
      console.error('No conversation ID returned');
      throw new Error('Failed to create conversation: No ID returned');
    }
    
    const conversationId = data[0].conversation_id;
    console.log('Created or found conversation with ID:', conversationId);
    
    // Send the initial message if provided
    if (initialMessage.trim() && conversationId) {
      console.log('Sending initial message to conversation:', conversationId);
      
      try {
        // Import locally to avoid circular dependencies
        const { sendMessage } = await import('../messagesService');
        const messageResult = await sendMessage(conversationId, initialMessage);
        
        if (!messageResult) {
          console.error('Failed to send initial message');
        } else {
          console.log('Initial message sent successfully');
        }
      } catch (msgErr) {
        console.error('Error sending initial message:', msgErr);
        // Don't throw here, we want to return the conversation even if message fails
      }
    }

    return conversationId ? { conversationId } : null;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error; // Re-throw to allow better error handling in the UI
  }
};
