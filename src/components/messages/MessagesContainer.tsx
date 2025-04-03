
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NewMessageDialog from '@/components/messages/NewMessageDialog';
import ConversationsList from '@/components/messages/ConversationsList';
import MessageView from '@/components/messages/MessageView';
import EmptyMessageView from '@/components/messages/EmptyMessageView';
import MessageHeader from '@/components/messages/MessageHeader';
import { getRecipient } from '@/services/messages';
import { useMessagesData } from '@/components/messages/hooks/useMessagesData';
import { useMessagesSubscriptions } from '@/components/messages/hooks/useMessagesSubscriptions';
import { useMessageHandlers } from '@/components/messages/hooks/useMessageHandlers';
import { useConversationSelection } from '@/components/messages/hooks/useConversationSelection';
import { formatDate, formatMessageTime } from '@/components/messages/utils/dateUtils';
import { markMessagesAsRead } from '@/services/messages';

const MessagesContainer = () => {
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
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
    sendMessageMutation
  } = useMessagesData(null);

  // Conversation selection functionality
  const {
    selectedConversationId: selectedId,
    handleConversationSelect,
    handleNewConversationCreated,
    handleSendMessage
  } = useConversationSelection(
    conversations,
    refetchConversations,
    sendMessageMutation
  );

  // Message handling functionality
  const { handleNewMessage, handleConversationUpdate } = useMessageHandlers(
    selectedId,
    refetchConversations
  );

  // Setup realtime subscriptions
  useMessagesSubscriptions(
    selectedId,
    handleNewMessage,
    handleConversationUpdate
  );

  // Get selected conversation and recipient
  const selectedConversation = conversations.find(c => c.id === selectedId);
  const selectedRecipient = selectedConversation && user 
    ? getRecipient(selectedConversation, user.id)
    : undefined;

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedId && user) {
      markMessagesAsRead(selectedId)
        .then(success => {
          if (success) {
            console.log('Messages marked as read');
            // Refetch to update unread counts
            refetchConversations();
          }
        })
        .catch(err => {
          console.error('Error marking messages as read:', err);
        });
    }
  }, [selectedId, user, refetchConversations]);

  // Force refetch on mount and when user changes
  useEffect(() => {
    if (user) {
      console.log("User logged in, fetching conversations:", user.id);
      refetchConversations();
    }
  }, [user, refetchConversations]);

  return (
    <div className="container py-8">
      <MessageHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista konwersacji */}
        <ConversationsList 
          conversations={conversations}
          isLoading={isLoadingConversations}
          selectedConversationId={selectedId}
          onSelectConversation={handleConversationSelect}
          onNewMessageClick={() => setIsNewMessageDialogOpen(true)}
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
              onNewMessageClick={() => setIsNewMessageDialogOpen(true)}
              isError={isConversationsError}
              onRefetch={refetchConversations}
            />
          )}
        </div>
      </div>
      
      <NewMessageDialog 
        open={isNewMessageDialogOpen} 
        onOpenChange={setIsNewMessageDialogOpen}
        onConversationCreated={handleNewConversationCreated}
      />
    </div>
  );
};

export default MessagesContainer;
