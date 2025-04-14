
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
        
        // Funkcjonalność wiadomości jest tymczasowo wyłączona
        setMessages([]);
        
        // Komentujemy wywołanie do pobierania wiadomości
        // const fetchedMessages = await getCollaborationMessages(collaboration.id);
        // setMessages(fetchedMessages);
        
        // Komentujemy oznaczanie wiadomości jako przeczytanych
        // await markCollaborationMessagesAsRead(collaboration.id);
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
      
      // Funkcjonalność wiadomości jest tymczasowo wyłączona
      toast({
        title: 'Informacja',
        description: 'Funkcjonalność wiadomości jest tymczasowo wyłączona i zostanie włączona wkrótce.',
      });
      
      // Komentujemy wysyłanie wiadomości
      // await sendCollaborationMessage(collaboration.id, newMessage);
      
      // Komentujemy aktualizowanie listy wiadomości
      // const updatedMessages = await getCollaborationMessages(collaboration.id);
      // setMessages(updatedMessages);
      
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
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Funkcjonalność tymczasowo wyłączona</AlertTitle>
        <AlertDescription>
          Możliwość przesyłania wiadomości w ramach współpracy jest obecnie wyłączona i zostanie aktywowana w przyszłości.
        </AlertDescription>
      </Alert>
      
      <div className="flex-grow overflow-y-auto mb-4 p-2 bg-gray-50 rounded-md">
        <div className="flex items-center justify-center h-full text-gray-500">
          Funkcjonalność wiadomości jest tymczasowo wyłączona.
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <Input 
          placeholder="Napisz wiadomość..." 
          className="flex-grow"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={true}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={true}
        >
          Wyślij
        </Button>
      </div>
    </div>
  );
};

export default CollaborationMessages;
