
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      if (!collaboration?.id) return;
      
      try {
        setIsLoading(true);
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
    
    // Set up real-time updates if needed - future enhancement
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
      
      // Fetch updated messages
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
  
  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-grow overflow-y-auto mb-4 p-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Brak wiadomości. Rozpocznij konwersację!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isMine
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      isMine ? 'text-primary-foreground/70' : 'text-gray-500'
                    }`}>
                      {formatMessageDate(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <Input 
          placeholder="Napisz wiadomość..." 
          className="flex-grow"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isSending}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
        >
          {isSending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Wysyłanie...
            </>
          ) : 'Wyślij'}
        </Button>
      </div>
    </div>
  );
};

export default CollaborationMessages;
