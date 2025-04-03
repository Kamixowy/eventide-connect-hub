
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '../types';
import { useEffect } from 'react';

// Hook for subscribing to new messages in a conversation
export const useMessageSubscription = (
  conversationId: string | null, 
  onNewMessage: (message: Message) => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!conversationId || !user) {
      console.log('No conversation ID or user, skipping subscription');
      return () => {};
    }

    console.log(`Setting up subscription for messages in conversation: ${conversationId}`);
    
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
          console.log('Received new message event:', payload);
          
          if (payload.new && payload.new.sender_id !== user.id) {
            console.log('Received new message from another user');
            
            // Mark the message as read if the conversation is open
            supabase.rpc('mark_messages_as_read', { conversation_id: conversationId })
              .then(() => console.log('Marked messages as read'))
              .catch(err => console.error('Failed to mark messages as read:', err));
            
            // Add the sender info
            const newMessage = payload.new as Message;
            onNewMessage(newMessage);
          } else {
            console.log('Ignoring message sent by current user');
          }
        }
      )
      .subscribe();

    console.log('Message subscription set up successfully');

    // Clean up subscription on unmount
    return () => {
      console.log('Cleaning up message subscription');
      channel.unsubscribe();
    };
  }, [conversationId, user, onNewMessage]);

  return { 
    subscription: conversationId && user ? 
      supabase.channel(`messages:${conversationId}`) : 
      null 
  };
};
