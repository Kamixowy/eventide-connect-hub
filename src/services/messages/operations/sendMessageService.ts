
import { supabase } from '@/integrations/supabase/client';
import { Message } from '../types';
import { createOrGetConversation } from './createOrGetConversation';

/**
 * Sends a message to an existing conversation
 */
export const sendMessageToConversation = async (
  conversationId: string,
  content: string
): Promise<Message | null> => {
  try {
    // Validate inputs
    if (!conversationId) throw new Error("Conversation ID is required");
    if (!content.trim()) throw new Error("Message content cannot be empty");
    
    console.log(`Sending message to conversation ${conversationId}: ${content}`);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to send messages");
    }
    
    // Create and send the message
    const { data: message, error } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim()
      })
      .select('*')
      .single();
    
    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
    
    console.log("Message sent successfully:", message);
    
    // Update the conversation timestamp
    await supabase
      .from('direct_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    return message;
  } catch (error) {
    console.error("Error in sendMessageToConversation:", error);
    throw error;
  }
};

/**
 * Starts a new conversation with a user and sends the first message
 */
export const startConversationWithMessage = async (
  recipientUserId: string,
  initialMessage: string
): Promise<{ conversationId: string, message: Message | null }> => {
  try {
    // Validate inputs
    if (!recipientUserId) throw new Error("Recipient user ID is required");
    if (!initialMessage.trim()) throw new Error("Message content cannot be empty");
    
    console.log(`Starting conversation with user ${recipientUserId}: ${initialMessage}`);
    
    // First, create or get the conversation
    const conversationId = await createOrGetConversation(recipientUserId);
    
    if (!conversationId) {
      throw new Error("Failed to create conversation");
    }
    
    // Then send the initial message
    const message = await sendMessageToConversation(conversationId, initialMessage);
    
    return {
      conversationId,
      message
    };
  } catch (error) {
    console.error("Error in startConversationWithMessage:", error);
    throw error;
  }
};

/**
 * Create a test conversation with sample messages
 */
export const createTestConversation = async (
  targetEmail: string
): Promise<{ conversationId: string } | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to create a test conversation");
    }
    
    // Find the target user by email
    const { data: targetUser, error: userError } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('email', targetEmail)
      .maybeSingle();
    
    if (userError || !targetUser) {
      console.error("Target user not found:", userError || "No user with that email");
      throw new Error("Target user not found");
    }
    
    // Create or get conversation
    const conversationId = await createOrGetConversation(targetUser.id);
    
    if (!conversationId) {
      throw new Error("Failed to create conversation");
    }
    
    // Add some test messages
    await supabase
      .from('direct_messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: user.id,
          content: `Hello ${targetUser.name || 'there'}! This is a test message.`
        },
        {
          conversation_id: conversationId,
          sender_id: targetUser.id,
          content: 'Hi! This is an automated test response.'
        },
        {
          conversation_id: conversationId,
          sender_id: user.id,
          content: 'How are you today?'
        }
      ]);
    
    return { conversationId };
  } catch (error) {
    console.error("Error creating test conversation:", error);
    return null;
  }
};
