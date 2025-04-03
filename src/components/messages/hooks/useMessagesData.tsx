
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchConversations } from '@/services/messages/operations/fetchConversations';
import { fetchMessages } from '@/services/messages/operations/fetchMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { markMessagesAsRead } from '@/services/messages/utils/messageUtils';
import { 
  sendMessageToConversation, 
  startConversationWithMessage 
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

  // Fetch conversations
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
    onError: (error: any) => {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać konwersacji. Spróbuj ponownie.',
        variant: 'destructive',
      });
    }
  });

  // Fetch messages for selected conversation
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
    refetchInterval: 5000, // Poll every 5 seconds for new messages
    onError: (error: any) => {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać wiadomości. Spróbuj ponownie.',
        variant: 'destructive',
      });
    }
  });

  // Simplified send message function
  const sendMessageMutation = async (conversationId: string, content: string) => {
    try {
      console.log("Sending message to conversation:", conversationId);
      
      if (!conversationId || !content.trim()) {
        throw new Error("Missing required data for sending message");
      }
      
      // Send message
      const message = await sendMessageToConversation(conversationId, content);
      
      if (message) {
        // Update UI optimistically
        queryClient.setQueryData(['messages', conversationId], (oldData: any[] | undefined) => {
          if (!oldData) return [message];
          if (oldData.some(m => m.id === message.id)) return oldData;
          return [...oldData, message];
        });
        
        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        
        return message;
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error('Error in send message mutation:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Start a new conversation and send the first message
  const startNewConversation = async (recipientId: string, initialMessage: string) => {
    try {
      console.log("Starting new conversation with recipient:", recipientId);
      
      const result = await startConversationWithMessage(recipientId, initialMessage);
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      return result;
    } catch (error) {
      console.error('Error starting new conversation:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się rozpocząć konwersacji. Spróbuj ponownie.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Create test conversation for development
  const createTestConversationWithEmail = async (email: string) => {
    try {
      const result = await import('@/services/messages/operations/sendMessageService')
        .then(module => module.createTestConversation(email));
      
      if (result) {
        toast({
          title: 'Sukces',
          description: 'Utworzono testową konwersację',
        });
        
        // Refresh conversations
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        
        return result.conversationId;
      } else {
        throw new Error("Failed to create test conversation");
      }
    } catch (error) {
      console.error('Error creating test conversation:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się utworzyć testowej konwersacji',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId && user) {
      markMessagesAsRead(selectedConversationId)
        .then(() => {
          // Refresh conversations to update unread count
          refetchConversations();
        })
        .catch(err => {
          console.error('Error marking messages as read:', err);
        });
    }
  }, [selectedConversationId, user, refetchConversations]);

  // Initial load 
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
