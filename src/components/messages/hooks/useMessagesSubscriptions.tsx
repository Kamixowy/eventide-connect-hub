
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

  // Rejestruj status subskrypcji do debugowania
  useEffect(() => {
    if (user) {
      console.log('Konfiguracja subskrypcji wiadomości dla użytkownika:', user.id);
      console.log('Wybrane ID konwersacji:', selectedConversationId);
    } else {
      console.log('Brak zalogowanego użytkownika, subskrypcje nie będą działać');
    }
  }, [user, selectedConversationId]);

  // Subskrybuj wiadomości w wybranej konwersacji
  const { subscription: messageSubscription } = useMessageSubscription(
    selectedConversationId,
    onNewMessage
  );
  
  // Subskrybuj aktualizacje konwersacji
  const { subscription: conversationSubscription } = useConversationsSubscription(
    onConversationUpdate
  );
  
  return {
    messageSubscription,
    conversationSubscription
  };
};
