
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/services/messages/types';
import { useAuth } from '@/contexts/AuthContext';

export const useMessageHandlers = (
  selectedConversationId: string | null,
  refetchConversations: () => Promise<any>
) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Handler for new messages from subscription
  const handleNewMessage = (newMessage: Message) => {
    console.log("Received new message from subscription:", newMessage);
    
    // Update messages cache only if we're currently viewing this conversation
    if (selectedConversationId && newMessage.conversation_id === selectedConversationId) {
      queryClient.setQueryData(['messages', selectedConversationId], (oldData: Message[] | undefined) => {
        if (!oldData) {
          console.log("No existing messages, creating new array with the message");
          return [newMessage];
        }
        
        // Avoid duplicates by checking if message already exists
        if (oldData.some(m => m.id === newMessage.id)) {
          console.log("Message already exists in cache, skipping addition");
          return oldData;
        }
        
        console.log("Adding new message to cache:", newMessage);
        return [...oldData, newMessage];
      });
    } else {
      console.log("Message is for a different conversation than the selected one");
    }
    
    // Refetch conversations to update last message and unread count
    console.log("Refetching conversations after new message");
    refetchConversations().catch(err => {
      console.error("Error refetching conversations:", err);
    });
  };

  // Handler for conversation updates from subscription
  const handleConversationUpdate = () => {
    console.log("Conversation update detected, refetching conversations");
    refetchConversations().catch(err => {
      console.error("Error refetching conversations after update:", err);
    });
  };

  return {
    handleNewMessage,
    handleConversationUpdate
  };
};
