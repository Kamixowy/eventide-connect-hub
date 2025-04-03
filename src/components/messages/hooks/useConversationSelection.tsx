
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { checkConversationParticipation } from '@/services/messages';
import { Conversation, Message } from '@/services/messages/types';

export const useConversationSelection = (
  conversations: Conversation[],
  refetchConversations: () => Promise<any>,
  sendMessageMutation: (conversationId: string, content: string) => Promise<any>
) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set default selected conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      console.log('Setting default selected conversation:', conversations[0].id);
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleConversationSelect = (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setSelectedConversationId(conversationId);
    // Refetch messages for the selected conversation
    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
  };

  const handleNewConversationCreated = (conversationId: string) => {
    console.log("New conversation created with ID:", conversationId);
    // Directly refetch conversations to make sure the new conversation appears
    refetchConversations().then(() => {
      // Set the newly created conversation as selected
      setSelectedConversationId(conversationId);
      
      // Invalidate messages query to force a fresh fetch
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    });
  };

  const handleSendMessage = async (newMessage: string) => {
    if (!selectedConversationId || !newMessage.trim() || !user) {
      console.error("Cannot send message - missing conversation ID, message content, or user");
      toast({
        title: "Błąd",
        description: "Nie można wysłać pustej wiadomości lub brak konwersacji",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log("Sending message to conversation:", selectedConversationId);
      // First check participation
      const canSend = await checkConversationParticipation(selectedConversationId, user.id);
      if (!canSend) {
        toast({
          title: "Błąd",
          description: "Nie masz uprawnień do wysyłania wiadomości w tej konwersacji.",
          variant: "destructive"
        });
        return;
      }
      
      // Send the message and handle the response
      const result = await sendMessageMutation(selectedConversationId, newMessage);
      
      if (result) {
        console.log("Message sent successfully:", result);
        
        // Force refresh messages
        queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
        
        // Refetch conversations to update last message
        refetchConversations();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas wysyłania wiadomości",
        variant: "destructive"
      });
    }
  };

  return {
    selectedConversationId,
    setSelectedConversationId,
    handleConversationSelect,
    handleNewConversationCreated,
    handleSendMessage
  };
};
