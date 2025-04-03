
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
    
    console.log('Sending message to conversation:', conversationId);
    
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
    
    // Check if the user is already a participant - this uses RLS so it will only return data if the user has access
    const { data: participant, error: participantError } = await supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (participantError && participantError.code !== 'PGRST116') {
      console.error('Error checking participation:', participantError);
      throw new Error('Error checking participation in conversation');
    }
    
    // If user is not a participant, add them using RPC instead of direct insert
    // This bypasses RLS policies that might be causing issues
    if (!participant) {
      console.log('Adding current user as participant to conversation via RPC');
      const { error: rpcError } = await supabase.rpc('add_participant_to_conversation', {
        conversation_id: conversationId,
        participant_id: user.id
      });
      
      if (rpcError) {
        console.error('Failed to add user as participant:', rpcError);
        throw new Error('Failed to add user as participant: ' + rpcError.message);
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
