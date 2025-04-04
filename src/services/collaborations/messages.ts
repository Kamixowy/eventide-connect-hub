
import { supabase } from '@/lib/supabase';
import { Message } from './types';

/**
 * Send a message in a collaboration conversation
 * 
 * @param collaborationId - ID of the collaboration
 * @param content - Message content
 * @returns Promise with the created message
 */
export const sendCollaborationMessage = async (
  collaborationId: string,
  content: string
): Promise<Message> => {
  try {
    // Check if the collaboration exists
    const { data: collaboration, error: collabError } = await supabase
      .from('collaborations')
      .select('*')
      .eq('id', collaborationId)
      .single();

    if (collabError) {
      console.error('Error fetching collaboration:', collabError);
      throw new Error('Nie znaleziono współpracy');
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create a new message in direct_messages table using collaboration ID as conversation_id
    const { data: message, error: messageError } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: collaborationId, // Using collaboration ID as conversation ID
        sender_id: user.id,
        content
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw new Error('Nie udało się wysłać wiadomości');
    }

    return message as Message;
  } catch (error: any) {
    console.error('Error in sendCollaborationMessage:', error);
    throw new Error(`Błąd podczas wysyłania wiadomości: ${error.message}`);
  }
};

/**
 * Get messages for a collaboration
 * 
 * @param collaborationId - ID of the collaboration
 * @returns Promise with array of messages
 */
export const getCollaborationMessages = async (collaborationId: string): Promise<Message[]> => {
  try {
    // Fetch messages directly using collaboration ID as conversation ID
    const { data: messages, error: messagesError } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('conversation_id', collaborationId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw new Error('Nie udało się pobrać wiadomości');
    }

    return messages as Message[] || [];
  } catch (error: any) {
    console.error('Error in getCollaborationMessages:', error);
    throw new Error(`Błąd podczas pobierania wiadomości: ${error.message}`);
  }
};

/**
 * Mark all messages in a collaboration as read
 * 
 * @param collaborationId - ID of the collaboration
 * @returns Promise with success status
 */
export const markCollaborationMessagesAsRead = async (collaborationId: string) => {
  try {
    // Call the RPC function to mark messages as read
    const { data, error } = await supabase.rpc('mark_messages_as_read', {
      conversation_id: collaborationId
    });

    if (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Nie udało się oznaczyć wiadomości jako przeczytane');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in markCollaborationMessagesAsRead:', error);
    throw new Error(`Błąd podczas oznaczania wiadomości jako przeczytane: ${error.message}`);
  }
};
