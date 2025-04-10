
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

const MessagesContainer = () => {
  const { user } = useAuth();

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
    selectedConversationId,
    setSelectedConversationId
  } = useMessagesData(null);

  // Message handling functionality
  const { handleNewMessage, handleConversationUpdate } = useMessageHandlers(
    selectedConversationId,
    refetchConversations
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
    setSelectedConversationId(conversationId);
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
              onRefetch={refetchConversations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesContainer;
