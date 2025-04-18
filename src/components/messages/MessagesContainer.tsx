
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ConversationsList from '@/components/messages/ConversationsList';
import MessageView from '@/components/messages/MessageView';
import EmptyMessageView from '@/components/messages/EmptyMessageView';
import MessageHeader from '@/components/messages/MessageHeader';
import { getRecipient } from '@/services/messages';
import { useMessagesData } from '@/components/messages/hooks/useMessagesData';
import { useMessagesSubscriptions } from '@/components/messages/hooks/useMessagesSubscriptions';
import { useMessageHandlers } from '@/components/messages/hooks/useMessageHandlers';
import { formatDate, formatMessageTime } from '@/components/messages/utils/dateUtils';
import { QueryObserverResult } from '@tanstack/react-query';
import { Conversation } from '@/services/messages/types';

const MessagesContainer = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationIdLocal] = useState<string | null>(null);

  // Fetch conversations and messages data
  const {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isConversationsError,
    refetchConversations,
    refetchMessages,
    sendMessageMutation,
  } = useMessagesData(selectedConversationId);

  // Message handling functionality
  const { handleNewMessage, handleConversationUpdate } = useMessageHandlers(
    selectedConversationId,
    () => {
      console.log("Refreshing conversations after update");
      // Create a mock query result to satisfy the type requirements
      const mockRefetch = async (): Promise<QueryObserverResult<Conversation[], Error>> => {
        await refetchConversations();
        return {
          data: conversations,
          dataUpdatedAt: Date.now(),
          error: null,
          errorUpdateCount: 0,
          errorUpdatedAt: 0,
          failureCount: 0,
          failureReason: null,
          fetchStatus: 'idle',
          isError: false,
          isFetched: true,
          isFetchedAfterMount: true,
          isFetching: false,
          isLoading: false,
          isLoadingError: false,
          isPaused: false,
          isPlaceholderData: false,
          isRefetchError: false,
          isRefetching: false,
          isStale: false,
          isSuccess: true,
          isPending: false,      // Add missing property
          isInitialLoading: false, // Add missing property
          refetch: async () => mockRefetch(),
          status: 'success'
        };
      };
      return mockRefetch();
    }
  );

  // Setup realtime subscriptions
  useMessagesSubscriptions(
    selectedConversationId,
    handleNewMessage,
    handleConversationUpdate
  );

  // Handler for selecting a conversation
  const handleConversationSelect = (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setSelectedConversationIdLocal(conversationId);
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !content.trim()) {
      console.error('Cannot send message: No conversation selected or empty message');
      return;
    }
    
    await sendMessageMutation(selectedConversationId, content);
    refetchMessages();
  };

  // Get selected conversation and recipient
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const selectedRecipient = selectedConversation && user 
    ? getRecipient(selectedConversation, user.id)
    : undefined;

  return (
    <div className="container py-8">
      <MessageHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista konwersacji */}
        <ConversationsList 
          conversations={conversations}
          isLoading={isLoadingConversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleConversationSelect}
          userId={user?.id}
          formatDate={formatDate}
        />
        
        {/* Widok konwersacji */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col bg-white">
          {selectedConversation && selectedRecipient ? (
            <MessageView 
              conversation={selectedConversation}
              recipient={selectedRecipient}
              messages={messages}
              isLoading={isLoadingMessages}
              onSendMessage={handleSendMessage}
              formatMessageTime={formatMessageTime}
              currentUserId={user?.id}
            />
          ) : (
            <EmptyMessageView 
              isLoading={isLoadingConversations}
              conversationsCount={conversations.length}
              isError={isConversationsError}
              onRefetch={() => {
                // Create a proper mock for the refetch function
                const mockRefetch = async (): Promise<QueryObserverResult<Conversation[], Error>> => {
                  await refetchConversations();
                  return {
                    data: conversations,
                    dataUpdatedAt: Date.now(),
                    error: null,
                    errorUpdateCount: 0,
                    errorUpdatedAt: 0,
                    failureCount: 0,
                    failureReason: null,
                    fetchStatus: 'idle',
                    isError: false,
                    isFetched: true,
                    isFetchedAfterMount: true,
                    isFetching: false,
                    isLoading: false,
                    isLoadingError: false,
                    isPaused: false,
                    isPlaceholderData: false,
                    isRefetchError: false,
                    isRefetching: false,
                    isStale: false,
                    isSuccess: true,
                    isPending: false,      // Add missing property
                    isInitialLoading: false, // Add missing property
                    refetch: async () => mockRefetch(),
                    status: 'success'
                  };
                };
                return mockRefetch();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesContainer;
