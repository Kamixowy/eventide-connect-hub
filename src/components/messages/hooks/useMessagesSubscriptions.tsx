
import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/services/messages/types';
import { 
  useMessageSubscription, 
  useConversationsSubscription, 
  checkConversationParticipation 
} from '@/services/messages';

export const useMessagesSubscriptions = (
  selectedConversationId: string | null,
  onNewMessage: (message: Message) => void,
  onConversationUpdate: () => void
) => {
  const { user } = useAuth();

  // Verify participation when conversation changes
  useEffect(() => {
    const verifyParticipation = async () => {
      if (!selectedConversationId || !user) return;
      
      try {
        const isParticipant = await checkConversationParticipation(
          selectedConversationId, 
          user.id
        );
        
        if (!isParticipant) {
          console.warn('User is not a participant in this conversation');
        }
      } catch (err) {
        console.error('Error verifying conversation participation:', err);
      }
    };
    
    verifyParticipation();
  }, [selectedConversationId, user]);

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
