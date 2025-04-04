
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchConversations } from '@/services/messages/operations/fetchConversations';
import { fetchMessages } from '@/services/messages/operations/fetchMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { markMessagesAsRead } from '@/services/messages/utils/messageUtils';
import { 
  sendMessageToConversation,
  startConversationWithMessage,
  createTestConversation
} from '@/services/messages/operations/sendMessageService';

export const useMessagesData = (initialSelectedConversationId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialSelectedConversationId);
  const { toast } = useToast();

  useEffect(() => {
    if (initialSelectedConversationId !== selectedConversationId) {
      setSelectedConversationId(initialSelectedConversationId);
    }
  }, [initialSelectedConversationId]);

  // Pobierz konwersacje
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations,
    isError: isConversationsError,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!user,
    retry: 2,
    staleTime: 30000,
    meta: {
      onError: (error: any) => {
        console.error('Błąd podczas pobierania konwersacji:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać konwersacji. Spróbuj ponownie.',
          variant: 'destructive',
        });
      }
    }
  });

  // Pobierz wiadomości dla wybranej konwersacji
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => selectedConversationId ? fetchMessages(selectedConversationId) : Promise.resolve([]),
    enabled: !!selectedConversationId,
    retry: 2,
    refetchInterval: 5000, // Odpytuj co 5 sekund o nowe wiadomości
    meta: {
      onError: (error: any) => {
        console.error('Błąd podczas pobierania wiadomości:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać wiadomości. Spróbuj ponownie.',
          variant: 'destructive',
        });
      }
    }
  });

  // Uproszczona funkcja wysyłania wiadomości
  const sendMessageMutation = async (conversationId: string, content: string) => {
    try {
      console.log("Wysyłanie wiadomości do konwersacji:", conversationId);
      
      if (!conversationId || !content.trim()) {
        throw new Error("Brakuje wymaganych danych do wysłania wiadomości");
      }
      
      // Wyślij wiadomość
      const message = await sendMessageToConversation(conversationId, content);
      
      if (message) {
        // Zaktualizuj UI optymistycznie
        queryClient.setQueryData(['messages', conversationId], (oldData: any[] | undefined) => {
          if (!oldData) return [message];
          if (oldData.some(m => m.id === message.id)) return oldData;
          return [...oldData, message];
        });
        
        // Unieważnij zapytania, aby odświeżyć dane
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        
        return message;
      } else {
        throw new Error("Nie udało się wysłać wiadomości");
      }
    } catch (error: any) {
      console.error('Błąd w mutacji wysyłania wiadomości:', error);
      throw error; // Przekaż błąd dalej, aby komponent mógł go obsłużyć
    }
  };

  // Rozpocznij nową konwersację i wyślij pierwszą wiadomość
  const startNewConversation = async (recipientId: string, initialMessage: string) => {
    try {
      console.log("Rozpoczynanie nowej konwersacji z odbiorcą:", recipientId);
      
      const result = await startConversationWithMessage(recipientId, initialMessage);
      
      // Unieważnij zapytania, aby odświeżyć dane
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      return result;
    } catch (error: any) {
      console.error('Błąd podczas rozpoczynania nowej konwersacji:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się rozpocząć konwersacji. Spróbuj ponownie.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Utwórz testową konwersację dla celów rozwojowych
  const createTestConversationWithEmail = async (email: string) => {
    try {
      const result = await createTestConversation(email);
      
      if (result) {
        toast({
          title: 'Sukces',
          description: 'Utworzono testową konwersację',
        });
        
        // Odśwież konwersacje
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        
        return result.conversationId;
      } else {
        throw new Error("Nie udało się utworzyć testowej konwersacji");
      }
    } catch (error: any) {
      console.error('Błąd podczas tworzenia testowej konwersacji:', error);
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się utworzyć testowej konwersacji',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Oznacz wiadomości jako przeczytane po wybraniu konwersacji
  useEffect(() => {
    if (selectedConversationId && user) {
      markMessagesAsRead(selectedConversationId)
        .then(() => {
          // Odśwież konwersacje, aby zaktualizować liczbę nieprzeczytanych
          refetchConversations();
        })
        .catch(err => {
          console.error('Błąd podczas oznaczania wiadomości jako przeczytane:', err);
        });
    }
  }, [selectedConversationId, user, refetchConversations]);

  // Początkowe ładowanie 
  useEffect(() => {
    if (user) {
      refetchConversations();
    }
  }, [user, refetchConversations]);

  return {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isConversationsError,
    isMessagesError,
    refetchConversations,
    refetchMessages,
    sendMessageMutation,
    startNewConversation,
    createTestConversationWithEmail,
    selectedConversationId,
    setSelectedConversationId
  };
};
