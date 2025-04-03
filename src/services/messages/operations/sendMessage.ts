
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';
import { checkConversationParticipation } from '../utils/messageUtils';

/**
 * Send a new message in a conversation
 */
export const sendMessage = async (conversationId: string, content: string): Promise<Message | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }
    
    console.log('Sending message to conversation:', conversationId);
    
    // Verify that the current user is a participant in this conversation
    const isParticipant = await checkConversationParticipation(conversationId, user.id);
    if (!isParticipant) {
      console.error('User is not a participant in this conversation');
      throw new Error('User is not a participant in this conversation');
    }
    
    // Create the message
    const { data: message, error } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    
    console.log('Message sent successfully:', message.id);
    return message;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
};
