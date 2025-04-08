
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
    
    // Find the conversation for this collaboration
    const { data: conversations, error: convError } = await supabase
      .from('direct_conversations')
      .select('id')
      .eq('collaboration_id', collaborationId);
      
    if (convError) {
      console.error('Error finding conversation:', convError);
      throw new Error('Nie znaleziono konwersacji dla tej współpracy');
    }
    
    let conversationId;
    
    if (conversations && conversations.length > 0) {
      // Use existing conversation
      conversationId = conversations[0].id;
    } else {
      // Create a new conversation for this collaboration
      // Fix: Use a properly typed object that matches the direct_conversations table schema
      const { data: newConversation, error: createError } = await supabase
        .from('direct_conversations')
        .insert({ 
          collaboration_id: collaborationId,
          updated_at: new Date().toISOString() 
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating conversation:', createError);
        throw new Error('Nie udało się utworzyć konwersacji');
      }
      
      conversationId = newConversation.id;
      
      // Add participants (sponsor and organization)
      await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversationId, user_id: collaboration.sponsor_id },
          { conversation_id: conversationId, user_id: collaboration.organization_id }
        ]);
    }

    // Create a new message in direct_messages table
    const { data: message, error: messageError } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
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
    // Find the conversation for this collaboration
    const { data: conversations, error: convError } = await supabase
      .from('direct_conversations')
      .select('id')
      .eq('collaboration_id', collaborationId);
      
    if (convError) {
      console.error('Error finding conversation:', convError);
      throw new Error('Nie znaleziono konwersacji dla tej współpracy');
    }
    
    if (!conversations || conversations.length === 0) {
      return []; // No conversation yet
    }
    
    const conversationId = conversations[0].id;

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('conversation_id', conversationId)
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
    // Find the conversation for this collaboration
    const { data: conversations, error: convError } = await supabase
      .from('direct_conversations')
      .select('id')
      .eq('collaboration_id', collaborationId);
      
    if (convError) {
      console.error('Error finding conversation:', convError);
      throw new Error('Nie znaleziono konwersacji dla tej współpracy');
    }
    
    if (!conversations || conversations.length === 0) {
      return { success: true }; // No conversation to mark
    }
    
    const conversationId = conversations[0].id;
    
    // Call the RPC function to mark messages as read
    const { data, error } = await supabase.rpc('mark_messages_as_read', {
      conversation_id: conversationId
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
