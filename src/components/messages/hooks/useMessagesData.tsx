
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchConversations } from '@/services/messages';
import { fetchMessages } from '@/services/messages';
import { sendMessage } from '@/services/messages';
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
    staleTime: 30000, // Consider data fresh for 30 seconds
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
      console.log("Sending message using mutation:", content);
      const result = await sendMessage(conversationId, content);
      
      if (result) {
        console.log("Message sent successfully:", result.id);
        // Add the message to the local cache
        queryClient.setQueryData(['messages', conversationId], (oldData: any[] | undefined) => {
          if (!oldData) return [result];
          return [...oldData, result];
        });
        
        // Force refetch conversations to make sure we get the latest data
        // This helps with newly created conversations
        refetchConversations();
        return result;
      } else {
        console.error("Message sending returned null result");
        throw new Error("Failed to send message");
      }
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
