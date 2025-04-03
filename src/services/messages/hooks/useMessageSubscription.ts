
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/services/messages/types';
import { useEffect } from 'react';

// Hook to subscribe to new messages in a specific conversation
export const useMessageSubscription = (
  conversationId: string | null,
  onNewMessage: (message: Message) => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user || !conversationId) {
      console.log('No user or conversation ID, skipping message subscription');
      return () => {};
    }

    console.log('Setting up subscription for messages in conversation:', conversationId);
    
    // Subscribe to direct_messages table for new messages in this conversation
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('New message detected:', payload);
          
          if (payload.new) {
            const newMessage = payload.new as Message;
            console.log('Processing new message:', newMessage);
            // Make sure we pass the message to the callback
            onNewMessage(newMessage);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Message subscription status for conversation ${conversationId}:`, status);
      });

    console.log('Message subscription set up successfully for conversation:', conversationId);

    // Clean up subscription on unmount
    return () => {
      console.log('Cleaning up message subscription for conversation:', conversationId);
      channel.unsubscribe();
    };
  }, [user, conversationId, onNewMessage]);

  return { 
    subscription: (user && conversationId) 
      ? supabase.channel(`messages-${conversationId}`) 
      : null 
  };
};
