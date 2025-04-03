
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

// Function to fetch messages for a specific conversation
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    console.log('Fetching messages for conversation:', conversationId);
    
    // Mark messages as read when fetching them
    await supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });

    const { data, error } = await supabase
      .from('direct_messages')
      .select(`
        *,
        sender:profiles(
          id,
          name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} messages`);
    
    // Ensure each message has the correct sender format
    const messagesWithFormattedSenders = data?.map(msg => {
      // If sender is an error or undefined, create a default sender
      const defaultSender = { id: msg.sender_id, name: 'Unknown', avatar_url: undefined };
      const formattedSender = msg.sender && !('error' in msg.sender) ? msg.sender : defaultSender;
      
      return {
        ...msg,
        sender: formattedSender
      };
    }) as Message[];
    
    return messagesWithFormattedSenders || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Function to send a new message
export const sendMessage = async (conversationId: string, content: string): Promise<Message | null> => {
  try {
    console.log('Sending message to conversation:', conversationId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('Sender ID:', user.id);
    
    const { data, error } = await supabase
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
    
    console.log('Message sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};
