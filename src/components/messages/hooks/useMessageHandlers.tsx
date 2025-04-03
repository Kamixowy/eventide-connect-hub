
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/services/messages/types';

export const useMessageHandlers = (
  selectedConversationId: string | null,
  refetchConversations: () => Promise<any>
) => {
  const queryClient = useQueryClient();

  // Handler for new messages from subscription
  const handleNewMessage = (newMessage: Message) => {
    // Update messages cache
    queryClient.setQueryData(['messages', selectedConversationId], (oldData: Message[] | undefined) => {
      if (!oldData) return [newMessage];
      // Avoid duplicates by checking if message already exists
      if (oldData.some(m => m.id === newMessage.id)) return oldData;
      return [...oldData, newMessage];
    });
    
    // Refetch conversations to update last message and unread count
    refetchConversations();
  };

  // Handler for conversation updates from subscription
  const handleConversationUpdate = () => {
    console.log("Conversation update detected, refetching conversations");
    refetchConversations();
  };

  return {
    handleNewMessage,
    handleConversationUpdate
  };
};
