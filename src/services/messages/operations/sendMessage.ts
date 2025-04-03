
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';

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
    
    console.log('Sending message to conversation:', conversationId, 'with content:', content);
    
    // First check if the conversation exists
    const { data: conversation, error: conversationError } = await supabase
      .from('direct_conversations')
      .select('id')
      .eq('id', conversationId)
      .single();
    
    if (conversationError) {
      console.error('Conversation does not exist:', conversationError);
      throw new Error('Conversation does not exist');
    }
    
    // Check if the user is already a participant
    const { data: participant, error: participantError } = await supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    // If there's an error other than "no rows returned", throw it
    if (participantError && participantError.code !== 'PGRST116') {
      console.error('Error checking participation:', participantError);
      throw new Error('Error checking participation in conversation');
    }
    
    // If user is not a participant, add them
    if (!participant) {
      console.log('Adding current user as participant to conversation');
      const { error: addParticipantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: user.id
        });
      
      if (addParticipantError) {
        console.error('Failed to add user as participant:', addParticipantError);
        throw new Error('Failed to add user as participant: ' + addParticipantError.message);
      }
      
      console.log('Successfully added user as participant to conversation');
    } else {
      console.log('User is already a participant in the conversation');
    }
    
    // Now create the message
    console.log('Creating message with content:', content);
    const { data: message, error: messageError } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content
      })
      .select('*')
      .single();
    
    if (messageError) {
      console.error('Error sending message:', messageError);
      throw new Error('Failed to send message: ' + messageError.message);
    }
    
    console.log('Message sent successfully:', message);
    return message;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};
