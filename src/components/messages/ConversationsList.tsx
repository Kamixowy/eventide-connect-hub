import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/services/messages';

interface ConversationsListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewMessageClick: () => void;
  userId: string | undefined;
  formatDate: (dateString: string) => string;
}

const ConversationsList = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
  onNewMessageClick,
  userId,
  formatDate
}: ConversationsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'organization' | 'sponsor'>('all');

  const getRecipient = (conversation: Conversation) => {
    if (!userId) return undefined;
    return conversation.participants?.find(p => p.user_id !== userId);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const recipient = getRecipient(conversation);
    if (!recipient) return false;
    
    const recipientName = recipient.profile?.name || recipient.organization?.name || '';
    const matchesSearch = searchQuery === '' || 
      recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const recipientType = recipient.profile?.user_type || 'organization';
    const matchesType = typeFilter === 'all' || recipientType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
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
            onClick={onNewMessageClick}
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
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-ngo" />
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => {
              const recipient = getRecipient(conversation);
              if (!recipient) return null;
              
              const recipientName = recipient.profile?.name || recipient.organization?.name || 'Użytkownik';
              const recipientAvatar = recipient.profile?.avatar_url || recipient.organization?.logo_url;
              const recipientType = recipient.profile?.user_type || 'organization';
              
              return (
                <div 
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedConversationId === conversation.id ? 'bg-gray-50' : ''}`}
                  onClick={() => onSelectConversation(conversation.id)}
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
  );
};

export default ConversationsList;
