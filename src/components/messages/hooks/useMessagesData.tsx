
// Adjust the function call parameter in useMessagesData.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchMessages } from '@/services/messages/operations/fetchMessages';
import { sendMessageToConversation, startConversationWithMessage } from '@/services/messages/operations/sendMessageService';
import { Message } from '@/services/messages/types';

export const useMessagesData = (selectedConversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to send a message
  const sendMessage = async (content: string) => {
    try {
      if (!selectedConversationId) {
        throw new Error('No conversation selected');
      }
      
      if (!user) {
        throw new Error('You must be logged in to send messages');
      }
      
      setIsLoading(true);
      
      const message = await sendMessageToConversation(selectedConversationId, content);
      
      // Optimistically update messages
      if (message) {
        setMessages(prev => [...prev, message]);
      }
      
      return message;
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
      
      // Fix: Pass only one parameter to startConversationWithMessage
      return await startConversationWithMessage(recipientId, initialMessage);
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
    sendMessage,
    startConversation
  };
};
