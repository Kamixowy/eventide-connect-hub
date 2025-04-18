
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchMessages } from '@/services/messages/operations/fetchMessages';
import { sendMessageToConversation, startConversationWithMessage } from '@/services/messages/operations/sendMessageService';
import { Message, Conversation } from '@/services/messages/types';
import { v4 as uuidv4 } from 'uuid';

export const useMessagesData = (selectedConversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isConversationsError, setIsConversationsError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to send a message
  const sendMessageMutation = async (conversationId: string, content: string) => {
    try {
      if (!conversationId) {
        throw new Error('No conversation selected');
      }
      
      if (!user) {
        throw new Error('You must be logged in to send messages');
      }
      
      setIsLoading(true);
      
      // Temporarily return null as this functionality is disabled
      console.log("sendMessageMutation is temporarily disabled");
      return null;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start a new conversation
  const startConversation = async (recipientId: string, initialMessage: string) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to start a conversation');
      }
      
      setIsLoading(true);
      
      // Return a mock response since the functionality is temporarily disabled
      console.log("startConversation is temporarily disabled");
      return {
        conversationId: "mock-id-" + uuidv4(),
        message: null
      };
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const refetchMessages = async () => {
    // Temporarily disabled - returns a Promise for compatibility
    console.log("refetchMessages is temporarily disabled");
    return Promise.resolve();
  };

  const refetchConversations = async () => {
    // Temporarily disabled - returns a Promise for compatibility
    console.log("refetchConversations is temporarily disabled");
    return Promise.resolve();
  };

  // Fetch messages when conversation changes
  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversationId) {
        setMessages([]);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedMessages = await fetchMessages(selectedConversationId);
        setMessages(fetchedMessages);
      } catch (error: any) {
        setError(error.message);
        toast({
          title: 'Error loading messages',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getMessages();
  }, [selectedConversationId, toast]);
  
  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageMutation,
    startConversation,
    conversations,
    isLoadingConversations,
    isLoadingMessages: isLoading,
    isConversationsError,
    refetchConversations,
    refetchMessages,
    selectedConversationId,
    sendMessageMutation
  };
};

