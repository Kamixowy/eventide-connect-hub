import { useState, useEffect } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import NewMessageDialog from '@/components/messages/NewMessageDialog';
import ConversationsList from '@/components/messages/ConversationsList';
import MessageView from '@/components/messages/MessageView';
import EmptyMessageView from '@/components/messages/EmptyMessageView';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage,
  getRecipient,
  useMessageSubscription,
  useConversationsSubscription,
  Message
} from '@/services/messages';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!user
  });

  // Set default selected conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Fetch messages for selected conversation
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => selectedConversationId ? fetchMessages(selectedConversationId) : Promise.resolve([]),
    enabled: !!selectedConversationId
  });

  // Subscribe to new messages
  const handleNewMessage = (message: Message) => {
    queryClient.setQueryData(['messages', selectedConversationId], (oldData: Message[] | undefined) => {
      if (!oldData) return [message];
      return [...oldData, message];
    });
    
    // Refetch conversations to update last message and unread count
    refetchConversations();
  };

  // Setup realtime subscriptions
  const { subscription: messageSubscription } = useMessageSubscription(
    selectedConversationId,
    handleNewMessage
  );

  const { subscription: conversationsSubscription } = useConversationsSubscription(
    () => {
      refetchConversations();
    }
  );

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      messageSubscription?.unsubscribe();
      conversationsSubscription?.unsubscribe();
    };
  }, [messageSubscription, conversationsSubscription]);

  // Get selected conversation
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  // Get recipient of the selected conversation
  const selectedRecipient = selectedConversation && user 
    ? getRecipient(selectedConversation, user.id) 
    : undefined;

  const handleSendMessage = async (newMessage: string) => {
    if (!selectedConversationId || !newMessage.trim() || !user) return;
    
    try {
      const result = await sendMessage(selectedConversationId, newMessage);
      if (result) {
        // Add the message to the local cache
        queryClient.setQueryData(['messages', selectedConversationId], (oldData: Message[] | undefined) => {
          if (!oldData) return [result];
          return [...oldData, result];
        });
        
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
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Wiadomości</h1>
        
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
      </div>
      
      <NewMessageDialog 
        open={isNewMessageDialogOpen} 
        onOpenChange={setIsNewMessageDialogOpen}
        onConversationCreated={handleNewConversationCreated}
      />
    </Layout>
  );
};

export default Messages;
