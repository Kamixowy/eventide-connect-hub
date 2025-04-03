
import { useEffect } from 'react';
import { useMessageSubscription, useConversationsSubscription } from '@/services/messages';
import { Message } from '@/services/messages/types';

// Custom hook to set up all realtime subscriptions for messages
export const useMessagesSubscriptions = (
  conversationId: string | null,
  onNewMessage: (message: Message) => void,
  onConversationUpdate: () => void
) => {
  // Subscribe to new messages for the selected conversation
  const { subscription: messageSubscription } = useMessageSubscription(
    conversationId,
    (newMessage) => {
      console.log('New message received:', newMessage);
      onNewMessage(newMessage);
    }
  );

  // Subscribe to conversation updates (new conversations, updates to existing ones)
  const { subscription: conversationsSubscription } = useConversationsSubscription(() => {
    console.log('Conversation update detected');
    onConversationUpdate();
  });

  // Clean up subscriptions on unmount (handled inside the hooks)
  useEffect(() => {
    return () => {
      console.log('Cleaning up message subscriptions');
    };
  }, []);

  return {
    messageSubscription,
    conversationsSubscription
  };
};
