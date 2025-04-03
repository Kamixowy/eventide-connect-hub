
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '../types';

// Hook for subscribing to new messages in a conversation
export const useMessageSubscription = (
  conversationId: string | null, 
  onNewMessage: (message: Message) => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  
  if (!conversationId || !user) {
    return { subscription: null };
  }

  // Subscribe to new messages
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        if (payload.new && payload.new.sender_id !== user.id) {
          // Mark the message as read if the conversation is open
          supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });
          
          // Add the sender info
          const newMessage = payload.new as Message;
          onNewMessage(newMessage);
        }
      }
    )
    .subscribe();

  return { subscription: channel };
};
