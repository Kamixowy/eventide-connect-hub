
import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCollaborationMessages, 
  sendCollaborationMessage,
  markCollaborationMessagesAsRead
} from '@/services/collaborations';
import { formatMessageDate } from '@/utils/dateUtils';

interface CollaborationMessagesProps {
  collaboration: any;
  userType: 'organization' | 'sponsor';
}

const CollaborationMessages = ({ collaboration, userType }: CollaborationMessagesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      if (!collaboration?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch messages from our new collaboration_messages table
        const fetchedMessages = await getCollaborationMessages(collaboration.id);
        setMessages(fetchedMessages);
        
        // Mark messages as read
        await markCollaborationMessagesAsRead(collaboration.id);
      } catch (error: any) {
        console.error('Error fetching collaboration messages:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać wiadomości',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [collaboration?.id, toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !collaboration?.id || isSending) return;
    
    try {
      setIsSending(true);
      
      await sendCollaborationMessage(collaboration.id, newMessage);
      
      // Refresh messages after sending
      const updatedMessages = await getCollaborationMessages(collaboration.id);
      setMessages(updatedMessages);
      
      // Clear input
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się wysłać wiadomości',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Brak wiadomości. Rozpocznij konwersację!
        </div>
      );
    }

    return messages.map((message) => {
      const isCurrentUser = user?.id === message.sender_id;
      
      return (
        <div 
          key={message.id}
          className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] rounded-lg p-3 ${
              isCurrentUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            <div className="text-sm mb-1">
              {message.content}
            </div>
            <div className="text-xs opacity-70 text-right">
              {formatMessageDate(message.created_at)}
            </div>
          </div>
        </div>
      );
    });
  };
  
  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-grow overflow-y-auto mb-4 p-2 bg-gray-50 rounded-md">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <Input 
          placeholder="Napisz wiadomość..." 
          className="flex-grow"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={isSending || !newMessage.trim()}
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Wyślij
        </Button>
      </div>
    </div>
  );
};

export default CollaborationMessages;
