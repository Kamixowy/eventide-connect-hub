import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchConversations } from '@/services/messages';
import { fetchMessages } from '@/services/messages';
import { sendMessage } from '@/services/messages';
import { useAuth } from '@/contexts/AuthContext';

export const useMessagesData = (selectedConversationId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!user,
    retry: 1,
    staleTime: 30000,
  });

  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => selectedConversationId ? fetchMessages(selectedConversationId) : Promise.resolve([]),
    enabled: !!selectedConversationId,
    retry: 1,
  });

  const sendMessageMutation = async (conversationId: string, content: string) => {
    try {
      console.log("Sending message to conversation:", conversationId);
      console.log("Message content:", content);
      
      if (!conversationId || !content.trim()) {
        console.error("Missing conversation ID or empty message content");
        throw new Error("Missing required data for sending message");
      }
      
      const result = await sendMessage(conversationId, content);
      
      if (result) {
        console.log("Message sent successfully:", result);
        
        queryClient.setQueryData(['messages', conversationId], (oldData: any[] | undefined) => {
          if (!oldData) return [result];
          if (oldData.some(m => m.id === result.id)) return oldData;
          return [...oldData, result];
        });
        
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        
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
