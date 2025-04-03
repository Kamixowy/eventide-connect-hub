import { useRef, useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message, ConversationParticipant, Conversation } from '@/services/messages';

interface MessageViewProps {
  conversation: Conversation | undefined;
  recipient: ConversationParticipant | undefined;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => Promise<void>;
  formatMessageTime: (dateString: string) => string;
  currentUserId: string | undefined;
}

const MessageView = ({
  conversation,
  recipient,
  messages,
  isLoading,
  onSendMessage,
  formatMessageTime,
  currentUserId
}: MessageViewProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    setError(null);
  }, [conversation?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      console.log("Attempting to send message:", newMessage);
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error: any) {
      console.error('Error in MessageView when sending message:', error);
      const errorMessage = error.message || "Wystąpił problem podczas wysyłania wiadomości";
      
      if (errorMessage.includes("column reference") && errorMessage.includes("ambiguous")) {
        setError("Błąd zapytania SQL. Prosimy o kontakt z administratorem.");
      } else if (errorMessage.includes("uprawnień")) {
        setError("Nie masz uprawnień do wysyłania wiadomości w tej konwersacji.");
      } else {
        setError(errorMessage);
      }
      
      toast({
        title: "Błąd wysyłania wiadomości",
        description: errorMessage,
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

  if (!conversation || !recipient) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-ngo" />
            <p>Ładowanie konwersacji...</p>
          </div>
        ) : (
          "Wybierz konwersację, aby wyświetlić wiadomości"
        )}
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={recipient.profile?.avatar_url || recipient.organization?.logo_url || ''} 
              alt={recipient.profile?.name || recipient.organization?.name || 'User'} 
            />
            <AvatarFallback>
              {(recipient.profile?.name || recipient.organization?.name || 'U').substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {recipient.profile?.name || recipient.organization?.name || 'Użytkownik'}
            </p>
            <Badge 
              variant="outline"
              className={`text-xs px-1.5 py-0 ${
                recipient.profile?.user_type === 'organization' 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' 
                  : 'bg-green-50 text-green-700 hover:bg-green-50'
              }`}
            >
              {recipient.profile?.user_type === 'organization' ? 'Organizacja' : 'Sponsor'}
            </Badge>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-grow p-4 h-[calc(100vh-420px)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-ngo" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex justify-center p-4 text-muted-foreground">
                <p>Brak wiadomości. Rozpocznij konwersację!</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender_id === currentUserId 
                      ? 'bg-ngo text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
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
        {error && (
          <div className="mb-2 p-2 text-sm bg-red-50 text-red-600 rounded border border-red-200">
            {error}
          </div>
        )}
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
  );
};

export default MessageView;
