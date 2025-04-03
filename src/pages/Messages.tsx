
import { useState, useEffect, useRef } from 'react';
import { Search, Send, ChevronDown, ChevronUp, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import NewMessageDialog from '@/components/messages/NewMessageDialog';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage,
  Conversation,
  Message,
  getRecipient,
  useMessageSubscription,
  useConversationsSubscription
} from '@/services/messageService';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'organization' | 'sponsor'>('all');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Get selected conversation
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  // Filter conversations
  const filteredConversations = conversations.filter((conversation) => {
    const recipient = user ? getRecipient(conversation, user.id) : undefined;
    if (!recipient) return false;
    
    const recipientName = recipient.profile?.name || recipient.organization?.name || '';
    const matchesSearch = searchQuery === '' || 
      recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const recipientType = recipient.profile?.user_type || 'organization';
    const matchesType = typeFilter === 'all' || recipientType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleSendMessage = async () => {
    if (!selectedConversationId || !newMessage.trim() || !user) return;
    
    setIsSending(true);
    try {
      const result = await sendMessage(selectedConversationId, newMessage);
      if (result) {
        setNewMessage('');
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
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  // Get recipient of the selected conversation
  const selectedRecipient = selectedConversation && user 
    ? getRecipient(selectedConversation, user.id) 
    : undefined;

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
          <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Szukaj wiadomości..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <button 
                  className="flex items-center text-sm font-medium"
                  onClick={() => setExpandedFilters(!expandedFilters)}
                >
                  Filtry
                  {expandedFilters ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                </button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-ngo"
                  onClick={() => setIsNewMessageDialogOpen(true)}
                >
                  <Plus size={16} className="mr-1" /> Nowa wiadomość
                </Button>
              </div>
              
              {expandedFilters && (
                <div className="flex flex-wrap gap-2 py-2">
                  <Badge 
                    variant={typeFilter === 'all' ? 'default' : 'outline'}
                    className={typeFilter === 'all' ? 'bg-ngo hover:bg-ngo/90' : 'hover:bg-gray-100 cursor-pointer'}
                    onClick={() => setTypeFilter('all')}
                  >
                    Wszystkie
                  </Badge>
                  <Badge 
                    variant={typeFilter === 'organization' ? 'default' : 'outline'}
                    className={typeFilter === 'organization' ? 'bg-ngo hover:bg-ngo/90' : 'hover:bg-gray-100 cursor-pointer'}
                    onClick={() => setTypeFilter('organization')}
                  >
                    Organizacje
                  </Badge>
                  <Badge 
                    variant={typeFilter === 'sponsor' ? 'default' : 'outline'}
                    className={typeFilter === 'sponsor' ? 'bg-ngo hover:bg-ngo/90' : 'hover:bg-gray-100 cursor-pointer'}
                    onClick={() => setTypeFilter('sponsor')}
                  >
                    Sponsorzy
                  </Badge>
                </div>
              )}
            </div>
            
            <ScrollArea className="h-[calc(100vh-320px)]">
              {isLoadingConversations ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-ngo" />
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => {
                    const recipient = user ? getRecipient(conversation, user.id) : undefined;
                    if (!recipient) return null;
                    
                    const recipientName = recipient.profile?.name || recipient.organization?.name || 'Użytkownik';
                    const recipientAvatar = recipient.profile?.avatar_url || recipient.organization?.logo_url;
                    const recipientType = recipient.profile?.user_type || 'organization';
                    
                    return (
                      <div 
                        key={conversation.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedConversationId === conversation.id ? 'bg-gray-50' : ''}`}
                        onClick={() => handleConversationSelect(conversation.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={recipientAvatar || ''} alt={recipientName} />
                            <AvatarFallback>{recipientName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium truncate">
                                {recipientName}
                              </p>
                              {conversation.lastMessage && (
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(conversation.lastMessage.created_at)}
                                </p>
                              )}
                            </div>
                            {conversation.lastMessage && (
                              <div className="flex items-center">
                                <p className={`text-xs truncate ${conversation.unreadCount ? 'font-semibold' : 'text-muted-foreground'}`}>
                                  {conversation.lastMessage.content}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 h-2 w-2 rounded-full bg-ngo"></span>
                                )}
                              </div>
                            )}
                            <div className="mt-1">
                              <Badge 
                                variant="outline"
                                className={`text-xs px-1.5 py-0 ${
                                  recipientType === 'organization' 
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                                    : 'bg-green-50 text-green-700 hover:bg-green-50'
                                }`}
                              >
                                {recipientType === 'organization' ? 'Organizacja' : 'Sponsor'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredConversations.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      {conversations.length === 0 
                        ? "Brak konwersacji. Rozpocznij nową konwersację, klikając przycisk 'Nowa wiadomość'." 
                        : "Nie znaleziono wiadomości spełniających kryteria wyszukiwania"}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
          
          {/* Widok konwersacji */}
          <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col bg-white">
            {selectedConversation && selectedRecipient ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={selectedRecipient.profile?.avatar_url || selectedRecipient.organization?.logo_url || ''} 
                        alt={selectedRecipient.profile?.name || selectedRecipient.organization?.name || 'User'} 
                      />
                      <AvatarFallback>
                        {(selectedRecipient.profile?.name || selectedRecipient.organization?.name || 'U').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedRecipient.profile?.name || selectedRecipient.organization?.name || 'Użytkownik'}
                      </p>
                      <Badge 
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${
                          selectedRecipient.profile?.user_type === 'organization' 
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                            : 'bg-green-50 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {selectedRecipient.profile?.user_type === 'organization' ? 'Organizacja' : 'Sponsor'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="flex-grow p-4 h-[calc(100vh-420px)]">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-ngo" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender_id === user?.id 
                                ? 'bg-ngo text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatMessageTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messageEndRef} />
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-end space-x-2">
                    <Textarea
                      placeholder="Napisz wiadomość..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[80px] resize-none"
                      disabled={isSending}
                    />
                    <Button 
                      className="btn-gradient"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
                {isLoadingConversations ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-ngo" />
                    <p>Ładowanie konwersacji...</p>
                  </div>
                ) : (
                  <>
                    {conversations.length === 0 ? (
                      <div className="max-w-md">
                        <h3 className="text-lg font-medium mb-2">Brak konwersacji</h3>
                        <p className="mb-4">Rozpocznij nową konwersację, aby nawiązać kontakt z organizacjami.</p>
                        <Button 
                          className="btn-gradient" 
                          onClick={() => setIsNewMessageDialogOpen(true)}
                        >
                          <Plus size={16} className="mr-1" /> Nowa wiadomość
                        </Button>
                      </div>
                    ) : (
                      "Wybierz konwersację, aby wyświetlić wiadomości"
                    )}
                  </>
                )}
              </div>
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
