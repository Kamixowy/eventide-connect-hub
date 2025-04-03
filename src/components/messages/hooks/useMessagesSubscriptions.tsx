
import { useEffect } from 'react';
import { Message } from '@/services/messages/types';
import { useMessageSubscription } from '@/services/messages/hooks/useMessageSubscription';
import { useConversationsSubscription } from '@/services/messages/hooks/useConversationsSubscription';

/**
 * A hook that manages all message-related subscriptions
 * @param selectedConversationId The ID of the currently selected conversation
 * @param onNewMessage Callback function for handling new messages
 * @param onConversationUpdate Callback function for handling conversation updates
 * @returns Object containing active subscriptions
 */
export const useMessagesSubscriptions = (
  selectedConversationId: string | null,
  onNewMessage: (message: Message) => void,
  onConversationUpdate: () => void
) => {
  // Subscribe to new messages in the selected conversation
  const { subscription: messageSubscription } = useMessageSubscription(
    selectedConversationId,
    onNewMessage
  );

  // Subscribe to conversation updates (new conversations, participants, etc.)
  const { subscription: conversationSubscription } = useConversationsSubscription(
    onConversationUpdate
  );

  // Clean up subscriptions on unmount or when selected conversation changes
  useEffect(() => {
    return () => {
      if (messageSubscription) {
        console.log('Cleaning up message subscription');
      }
      if (conversationSubscription) {
        console.log('Cleaning up conversation subscription');
      }
    };
  }, [messageSubscription, conversationSubscription]);

  return {
    messageSubscription,
    conversationSubscription
  };
};
