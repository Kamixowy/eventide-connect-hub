
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

// Hook to subscribe to conversation updates (new conversations, new messages)
export const useConversationsSubscription = (
  onUpdate: () => void
): { subscription: RealtimeChannel | null } => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) {
      console.log('No user, skipping conversation subscription');
      return () => {};
    }

    console.log('Setting up subscription for conversation updates');
    
    // Subscribe to direct_conversations and direct_messages tables
    const channel = supabase
      .channel('conversation_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_conversations'
        },
        (payload) => {
          console.log('Conversation table change detected:', payload);
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          console.log('New message detected:', payload);
          
          if (payload.new && payload.new.sender_id !== user.id) {
            // Show a toast notification for new messages
            toast({
              title: "Nowa wiadomość",
              description: "Otrzymałeś nową wiadomość",
              duration: 3000,
            });
            onUpdate();
          } else {
            onUpdate();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Added to new conversation:', payload);
          onUpdate();
        }
      )
      .subscribe();

    console.log('Conversation subscription set up successfully');

    // Clean up subscription on unmount
    return () => {
      console.log('Cleaning up conversation subscription');
      channel.unsubscribe();
    };
  }, [user, onUpdate, toast]);

  return { 
    subscription: user ? 
      supabase.channel('conversation_updates') : 
      null 
  };
};
