
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, fetchMessages, sendMessage } from '@/services/messages';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
    onError: (error: any) => {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać wiadomości. Spróbuj ponownie.',
        variant: 'destructive',
      });
    }
  });

  // Improved send message function with enhanced error logging
  const sendMessageMutation = async (conversationId: string, content: string) => {
    try {
      console.log("Starting sending message to conversation:", conversationId);
      console.log("Message content:", content);
      
      if (!conversationId || !content.trim()) {
        console.error("Missing conversation ID or empty message content");
        throw new Error("Missing required data for sending message");
      }
      
      // Send message and get result
      const result = await sendMessage(conversationId, content);
      
      if (result) {
        console.log("Message sent successfully:", result);
        
        // Optimistically update UI
        queryClient.setQueryData(['messages', conversationId], (oldData: any[] | undefined) => {
          if (!oldData) return [result];
          // Check for duplicates before adding
          if (oldData.some(m => m.id === result.id)) return oldData;
          return [...oldData, result];
        });
        
        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        
        return result;
      } else {
        console.error("Message sending returned null result");
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

  // Force refetch conversations on component mount
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
    selectedConversationId,
    setSelectedConversationId
  };
};
