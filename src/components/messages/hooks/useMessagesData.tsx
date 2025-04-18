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
import { supabase } from '@/lib/supabase';

export const useMessagesData = (initialSelectedConversationId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialSelectedConversationId);
  const { toast } = useToast();
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    if (initialSelectedConversationId !== selectedConversationId) {
      setSelectedConversationId(initialSelectedConversationId);
    }
  }, [initialSelectedConversationId]);

  useEffect(() => {
    const fetchOrganizationId = async () => {
      if (user?.user_metadata?.userType === 'organization') {
        try {
          const { data, error } = await supabase
            .from('organizations')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching organization:', error);
          } else if (data) {
            console.log('Organization found:', data);
            setOrganizationId(data.id);
          }
        } catch (err) {
          console.error('Failed to fetch organization data:', err);
        }
      }
    };
    
    if (user) {
      fetchOrganizationId();
    }
  }, [user]);

  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations,
    isError: isConversationsError,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations', organizationId],
    queryFn: async () => {
      if (user?.user_metadata?.userType === 'organization' && organizationId) {
        return fetchConversations();
      }
      return fetchConversations();
    },
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
    refetchInterval: 5000,
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

  const sendMessageMutation = async (conversationId: string, content: string) => {
    try {
      console.log("Wysyłanie wiadomości do konwersacji:", conversationId);
      
      if (!conversationId || !content.trim()) {
        throw new Error("Brakuje wymaganych danych do wysłania wiadomości");
      }
      
      const message = await sendMessageToConversation(conversationId, content);
      
      if (message) {
        queryClient.setQueryData(['messages', conversationId], (oldData: any[] | undefined) => {
          if (!oldData) return [message];
          if (oldData.some(m => m.id === message.id)) return oldData;
          return [...oldData, message];
        });
        
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        
        return message;
      } else {
        throw new Error("Nie udało się wysłać wiadomości");
      }
    } catch (error: any) {
      console.error('Błąd w mutacji wysyłania wiadomości:', error);
      throw error;
    }
  };

  const startNewConversation = async (recipientId: string, initialMessage: string) => {
    try {
      console.log("Rozpoczynanie nowej konwersacji z odbiorcą:", recipientId);
      
      const result = await startConversationWithMessage(recipientId, initialMessage);
      
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

  const createTestConversationWithEmail = async (email: string) => {
    try {
      const result = await createTestConversation(email);
      
      if (result) {
        toast({
          title: 'Sukces',
          description: 'Utworzono testową konwersację',
        });
        
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

  useEffect(() => {
    if (selectedConversationId && user) {
      markMessagesAsRead(selectedConversationId)
        .then(() => {
          refetchConversations();
        })
        .catch(err => {
          console.error('Błąd podczas oznaczania wiadomości jako przeczytane:', err);
        });
    }
  }, [selectedConversationId, user, refetchConversations]);

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
    setSelectedConversationId,
    organizationId
  };
};
