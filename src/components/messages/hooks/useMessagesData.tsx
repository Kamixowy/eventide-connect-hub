
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, fetchMessages, sendMessage } from '@/services/messages';
import { useAuth } from '@/contexts/AuthContext';

export const useMessagesData = (selectedConversationId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!user,
    retry: 1, // Only retry once to avoid excessive requests on error
  });

  // Fetch messages for selected conversation
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => selectedConversationId ? fetchMessages(selectedConversationId) : Promise.resolve([]),
    enabled: !!selectedConversationId,
    retry: 1, // Only retry once to avoid excessive requests on error
  });

  // Mutation for sending messages
  const sendMessageMutation = async (conversationId: string, content: string) => {
    try {
      const result = await sendMessage(conversationId, content);
      if (result) {
        // Add the message to the local cache
        queryClient.setQueryData(['messages', conversationId], (oldData: any[] | undefined) => {
          if (!oldData) return [result];
          return [...oldData, result];
        });
      }
      return result;
    } catch (error) {
      console.error('Error in send message mutation:', error);
      throw error;
    }
  };

  return {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    refetchConversations,
    refetchMessages,
    sendMessageMutation
  };
};
