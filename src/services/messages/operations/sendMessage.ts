
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';

/**
 * Send a new message in a conversation
 */
export const sendMessage = async (conversationId: string, content: string): Promise<Message | null> => {
  try {
    // Get current user
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
    
    // Now create the message - ensuring content is not empty
    if (!content || content.trim() === '') {
      console.error('Cannot send empty message');
      throw new Error('Message content cannot be empty');
    }
    
    console.log('Creating message with content:', content);
    const { data: message, error: messageError } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim()
      })
      .select('*')
      .single();
    
    if (messageError) {
      console.error('Error sending message:', messageError);
      throw new Error('Failed to send message: ' + messageError.message);
    }
    
    console.log('Message sent successfully:', message);
    
    // Update the conversation timestamp
    const { error: updateError } = await supabase
      .from('direct_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
      
    if (updateError) {
      console.warn('Failed to update conversation timestamp:', updateError);
      // Don't throw here, the message was already sent
    }
    
    return message;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

/**
 * Create test conversation with messages for a specified user
 * This function creates a conversation with test messages
 */
export const createTestConversation = async (targetEmail: string): Promise<{ conversationId: string, participantId: string } | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }
    
    console.log('Creating test conversation with user email:', targetEmail);
    
    // First, find the user by email
    const { data: targetUser, error: userError } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('email', targetEmail)
      .maybeSingle();
    
    if (userError || !targetUser) {
      console.error('Target user not found:', userError || 'No user with that email');
      throw new Error('Target user not found');
    }
    
    console.log('Found target user:', targetUser);
    
    // Create a new conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('direct_conversations')
      .insert({})
      .select('id')
      .single();
    
    if (conversationError) {
      console.error('Failed to create conversation:', conversationError);
      throw new Error('Failed to create conversation');
    }
    
    console.log('Created new conversation:', conversation.id);
    
    // Add both users as participants
    const { data: participants, error: participantError } = await supabase
      .from('conversation_participants')
      .insert([
        {
          conversation_id: conversation.id,
          user_id: user.id
        },
        {
          conversation_id: conversation.id,
          user_id: targetUser.id
        }
      ])
      .select('id, user_id')
      .order('created_at', { ascending: true });
    
    if (participantError) {
      console.error('Failed to add participants:', participantError);
      throw new Error('Failed to add participants');
    }
    
    console.log('Added participants to conversation:', participants);
    
    // Add some initial messages
    const { error: messagesError } = await supabase
      .from('direct_messages')
      .insert([
        {
          conversation_id: conversation.id,
          sender_id: user.id,
          content: `Hello ${targetUser.name || 'there'}! This is a test message.`
        },
        {
          conversation_id: conversation.id,
          sender_id: targetUser.id,
          content: 'Hi! This is an automated test response.'
        }
      ]);
    
    if (messagesError) {
      console.error('Failed to add test messages:', messagesError);
      throw new Error('Failed to add test messages');
    }
    
    console.log('Added test messages to conversation');
    
    return {
      conversationId: conversation.id,
      participantId: targetUser.id
    };
  } catch (error) {
    console.error('Error creating test conversation:', error);
    return null;
  }
};
