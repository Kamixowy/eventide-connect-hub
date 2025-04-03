
import { useEffect } from 'react';
import { Message } from '@/services/messages/types';
import { useMessageSubscription } from '@/services/messages/hooks/useMessageSubscription';
import { useConversationsSubscription } from '@/services/messages/hooks/useConversationsSubscription';
import { useAuth } from '@/contexts/AuthContext';

export const useMessagesSubscriptions = (
  selectedConversationId: string | null,
  onNewMessage: (message: Message) => void,
  onConversationUpdate: () => void
) => {
  const { user } = useAuth();

  // Log subscription status for debugging
  useEffect(() => {
    if (user) {
      console.log('Message subscription setup for user:', user.id);
      console.log('Selected conversation ID:', selectedConversationId);
    } else {
      console.log('No user logged in, subscriptions will not work');
    }
  }, [user, selectedConversationId]);

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
