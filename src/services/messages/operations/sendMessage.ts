
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
    // We'll check the participant status directly from the database
    const { data: participant, error: participantError } = await supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single();
    
    if (participantError) {
      console.error('Error checking conversation participation:', participantError);
      
      // Special case: Check if we're responding to a newly created conversation
      // In this case, let's query the conversation to make sure it exists first
      const { data: conversation, error: conversationError } = await supabase
        .from('direct_conversations')
        .select('id')
        .eq('id', conversationId)
        .single();
      
      if (conversationError || !conversation) {
        console.error('Conversation does not exist:', conversationError);
        
        // Since we're trying to send a message to a new conversation,
        // let's try to create the conversation first
        console.log('Attempting to create a new conversation with ID:', conversationId);
        
        const { data: newConversation, error: createError } = await supabase
          .from('direct_conversations')
          .insert({
            id: conversationId
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating conversation:', createError);
          throw new Error('Failed to create conversation');
        }
        
        console.log('Successfully created conversation:', newConversation.id);
      }
      
      // Now try to add the user as a participant
      console.log('Adding current user as participant to conversation');
      const { error: insertError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: user.id
        });
      
      if (insertError) {
        console.error('Failed to add user as participant:', insertError);
        throw new Error('Failed to add user as participant');
      }
      
      console.log('Successfully added user as participant to conversation');
    } else {
      console.log('User is already a participant in the conversation');
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
    throw error;
  }
};
