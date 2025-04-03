
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '../types';
import { useEffect, useState } from 'react';

// Hook for subscribing to new messages in a conversation
export const useMessageSubscription = (
  conversationId: string | null, 
  onNewMessage: (message: Message) => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  
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
        async (payload) => {
          console.log('Received new message event:', payload);
          
          if (payload.new && payload.new.sender_id !== user.id) {
            console.log('Received new message from another user');
            
            try {
              // Mark the message as read if the conversation is open
              await supabase.rpc('mark_messages_as_read', { conversation_id: conversationId });
              console.log('Marked messages as read');
              
              // Fetch full message data with sender info
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
                .eq('id', payload.new.id)
                .single();
                
              if (error) {
                console.error('Error fetching complete message data:', error);
                // Still process with limited data
                const newMessage = payload.new as Message;
                onNewMessage(newMessage);
                return;
              }
              
              // Add the sender info and call the callback
              const newMessage = data as Message;
              onNewMessage(newMessage);
            } catch (err) {
              console.error('Error processing new message:', err);
              // Fall back to basic message data
              const newMessage = payload.new as Message;
              onNewMessage(newMessage);
            }
          } else {
            console.log('Ignoring message sent by current user');
          }
        }
      )
      .subscribe((status) => {
        console.log(`Message subscription status: ${status}`);
      });

    console.log('Message subscription set up successfully');
    setSubscription(channel);

    // Clean up subscription on unmount
    return () => {
      console.log('Cleaning up message subscription');
      channel.unsubscribe();
    };
  }, [conversationId, user, onNewMessage]);

  return { subscription };
};
