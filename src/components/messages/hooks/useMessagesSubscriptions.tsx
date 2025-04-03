
import { useEffect } from 'react';
import { Message } from '@/services/messages/types';
import { useMessageSubscription } from '@/services/messages/hooks/useMessageSubscription';
import { useConversationsSubscription } from '@/services/messages/hooks/useConversationsSubscription';

export const useMessagesSubscriptions = (
  selectedConversationId: string | null,
  onNewMessage: (message: Message) => void,
  onConversationUpdate: () => void
) => {
  // Log subscription status for debugging
  useEffect(() => {
    console.log('Message subscription setup with conversation ID:', selectedConversationId);
  }, [selectedConversationId]);

  // Subscribe to messages in the selected conversation
  const { subscription: messageSubscription } = useMessageSubscription(
    selectedConversationId,
    onNewMessage
  );
  
  // Subscribe to conversation updates
  const { subscription: conversationSubscription } = useConversationsSubscription(
    onConversationUpdate
  );
  
  return {
    messageSubscription,
    conversationSubscription
  };
};
