
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import NewMessageDialog from '@/components/messages/NewMessageDialog';
import ConversationsList from '@/components/messages/ConversationsList';
import MessageView from '@/components/messages/MessageView';
import EmptyMessageView from '@/components/messages/EmptyMessageView';
import MessageHeader from '@/components/messages/MessageHeader';
import { Message } from '@/services/messages';
import { useMessagesData } from '@/components/messages/hooks/useMessagesData';
import { useMessagesSubscriptions } from '@/components/messages/hooks/useMessagesSubscriptions';

const MessagesContainer = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversations and messages data
  const {
    conversations,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    refetchConversations,
    refetchMessages,
    sendMessageMutation
  } = useMessagesData(selectedConversationId);

  // Setup realtime subscriptions
  useMessagesSubscriptions(
    selectedConversationId,
    (newMessage: Message) => {
      // Update messages cache
      queryClient.setQueryData(['messages', selectedConversationId], (oldData: Message[] | undefined) => {
        if (!oldData) return [newMessage];
        return [...oldData, newMessage];
      });
      
      // Refetch conversations to update last message and unread count
      refetchConversations();
    },
    () => {
      refetchConversations();
    }
  );

  // Set default selected conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Get selected conversation and recipient
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const selectedRecipient = selectedConversation && user 
    ? selectedConversation.participants?.find(p => p.user_id !== user.id)
    : undefined;

  const handleSendMessage = async (newMessage: string) => {
    if (!selectedConversationId || !newMessage.trim() || !user) return;
    
    try {
      const result = await sendMessageMutation(selectedConversationId, newMessage);
      if (result) {
        // Message added to cache in mutation
        // Refetch conversations to update last message
        refetchConversations();
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
          variant: "destructive"
        });
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

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Refetch messages for the selected conversation
    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
  };

  const handleNewConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    refetchConversations();
  };

  // Format date to display only the date part
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  // Format time to display in messages
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) + 
           ' • ' + 
           date.toLocaleDateString('pl-PL');
  };

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
