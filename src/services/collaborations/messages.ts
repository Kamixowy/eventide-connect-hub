
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
    
    // Create a new message in collaboration_messages table
    const { data: message, error: messageError } = await supabase
      .from('collaboration_messages')
      .insert({
        collaboration_id: collaborationId,
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
    // Fetch messages directly from collaboration_messages
    const { data: messages, error: messagesError } = await supabase
      .from('collaboration_messages')
      .select(`
        id,
        collaboration_id,
        sender_id,
        content,
        created_at,
        read_at
      `)
      .eq('collaboration_id', collaborationId)
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Update all unread messages not sent by current user
    const { error } = await supabase
      .from('collaboration_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('collaboration_id', collaborationId)
      .neq('sender_id', user.id)
      .is('read_at', null);

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
