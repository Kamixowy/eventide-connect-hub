
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NewMessageDialog from '@/components/messages/NewMessageDialog';
import ConversationsList from '@/components/messages/ConversationsList';
import MessageView from '@/components/messages/MessageView';
import EmptyMessageView from '@/components/messages/EmptyMessageView';
import MessageHeader from '@/components/messages/MessageHeader';
import { getRecipient } from '@/services/messages';
import { useMessagesData } from '@/components/messages/hooks/useMessagesData';
import { useMessagesSubscriptions } from '@/components/messages/hooks/useMessagesSubscriptions';
import { useConversationSelection } from '@/components/messages/hooks/useConversationSelection';
import { useMessageHandlers } from '@/components/messages/hooks/useMessageHandlers';
import { formatDate, formatMessageTime } from '@/components/messages/utils/dateUtils';

const MessagesContainer = () => {
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const { user } = useAuth();

  // Fetch conversations and messages data
  const {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    refetchConversations,
    refetchMessages,
    sendMessageMutation,
    selectedConversationId,
    setSelectedConversationId
  } = useMessagesData(null);  // We'll set the selected ID in useEffect

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
    selectedId,  // Pass the selected conversation ID from the selection hook
    refetchConversations
  );

  // Setup realtime subscriptions
  useMessagesSubscriptions(
    selectedId,  // Pass the selected conversation ID from the selection hook
    handleNewMessage,
    handleConversationUpdate
  );

  // Get selected conversation and recipient
  const selectedConversation = conversations.find(c => c.id === selectedId);
  const selectedRecipient = selectedConversation && user 
    ? getRecipient(selectedConversation, user.id)
    : undefined;

  // Log debugging information
  console.log("Current user ID:", user?.id);
  console.log("Selected conversation ID:", selectedId);
  console.log("Conversation count:", conversations.length);
  console.log("Message count:", messages.length);

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
