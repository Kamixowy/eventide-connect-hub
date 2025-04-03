
import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/services/messages';
import { useMessageSubscription, useConversationsSubscription } from '@/services/messages';

export const useMessagesSubscriptions = (
  selectedConversationId: string | null,
  onNewMessage: (message: Message) => void,
  onConversationUpdate: () => void
) => {
  const { user } = useAuth();

  // Setup message subscription
  const { subscription: messageSubscription } = useMessageSubscription(
    selectedConversationId,
    onNewMessage
  );

  // Setup conversation subscription
  const { subscription: conversationsSubscription } = useConversationsSubscription(
    onConversationUpdate
  );

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      if (messageSubscription) {
        console.log('Cleaning up message subscription from hook');
        messageSubscription.unsubscribe();
      }
      if (conversationsSubscription) {
        console.log('Cleaning up conversations subscription from hook');
        conversationsSubscription.unsubscribe();
      }
    };
  }, [messageSubscription, conversationsSubscription]);

  return {
    messageSubscription,
    conversationsSubscription
  };
};
