
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/services/messages/types';
import { useAuth } from '@/contexts/AuthContext';

export const useMessageHandlers = (
  selectedConversationId: string | null,
  refetchConversations: () => Promise<any>
) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Obsługa nowych wiadomości z subskrypcji
  const handleNewMessage = (newMessage: Message) => {
    console.log("Otrzymano nową wiadomość z subskrypcji:", newMessage);
    
    // Aktualizuj pamięć podręczną wiadomości tylko jeśli aktualnie przeglądamy tę konwersację
    if (selectedConversationId && newMessage.conversation_id === selectedConversationId) {
      queryClient.setQueryData(['messages', selectedConversationId], (oldData: Message[] | undefined) => {
        if (!oldData) {
          console.log("Brak istniejących wiadomości, tworzenie nowej tablicy z wiadomością");
          return [newMessage];
        }
        
        // Unikaj duplikatów, sprawdzając, czy wiadomość już istnieje
        if (oldData.some(m => m.id === newMessage.id)) {
          console.log("Wiadomość już istnieje w pamięci podręcznej, pomijanie dodawania");
          return oldData;
        }
        
        console.log("Dodawanie nowej wiadomości do pamięci podręcznej:", newMessage);
        return [...oldData, newMessage];
      });
    } else {
      console.log("Wiadomość jest dla innej konwersacji niż wybrana");
    }
    
    // Odśwież konwersacje, aby zaktualizować ostatnią wiadomość i liczbę nieprzeczytanych
    console.log("Odświeżanie konwersacji po nowej wiadomości");
    refetchConversations().catch(err => {
      console.error("Błąd podczas odświeżania konwersacji:", err);
    });
  };

  // Obsługa aktualizacji konwersacji z subskrypcji
  const handleConversationUpdate = () => {
    console.log("Wykryto aktualizację konwersacji, odświeżanie konwersacji");
    refetchConversations().catch(err => {
      console.error("Błąd odświeżania konwersacji po aktualizacji:", err);
    });
  };

  return {
    handleNewMessage,
    handleConversationUpdate
  };
};
