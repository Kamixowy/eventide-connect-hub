
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/services/messages/types';

export const useMessageHandlers = (
  selectedConversationId: string | null,
  refetchConversations: () => Promise<any>
) => {
  const queryClient = useQueryClient();

  // Handler for new messages from subscription
  const handleNewMessage = (newMessage: Message) => {
    console.log("Received new message from subscription:", newMessage);
    
    // Update messages cache
    if (selectedConversationId && newMessage.conversation_id === selectedConversationId) {
      queryClient.setQueryData(['messages', selectedConversationId], (oldData: Message[] | undefined) => {
        if (!oldData) return [newMessage];
        // Avoid duplicates by checking if message already exists
        if (oldData.some(m => m.id === newMessage.id)) return oldData;
        console.log("Adding new message to cache:", newMessage);
        return [...oldData, newMessage];
      });
    }
    
    // Refetch conversations to update last message and unread count
    console.log("Refetching conversations after new message");
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
