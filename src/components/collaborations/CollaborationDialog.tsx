
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, Edit, XCircle } from 'lucide-react';
import { CollaborationType } from '@/types/collaboration';
import { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CollaborationDialogProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
  children: ReactNode;
}

export const CollaborationDialog = ({ collaboration, userType, children }: CollaborationDialogProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    try {
      // Mock sending a message - in real implementation, this would send to Supabase
      setTimeout(() => {
        toast({
          title: "Wiadomość wysłana",
          description: "Twoja wiadomość została wysłana pomyślnie",
        });
        setMessage('');
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending collaboration message:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive"
      });
      setIsSending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Szczegóły współpracy</DialogTitle>
          <DialogDescription>
            {collaboration.event.title} - {collaboration.status}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Organizacja</p>
            <p className="font-medium">{collaboration.event.organization}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sponsor</p>
            <p className="font-medium">{collaboration.sponsor.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Wartość</p>
            <p className="font-medium">{collaboration.totalAmount} PLN</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Opcje współpracy</h3>
          <div className="space-y-2">
            {collaboration.sponsorshipOptions.map((option, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex justify-between">
                  <p className="font-medium">{option.title}</p>
                  <p>{option.amount} PLN</p>
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Konwersacja</h3>
          <div className="max-h-80 overflow-y-auto space-y-3 border rounded-md p-3">
            {collaboration.conversation.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'sponsor' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'sponsor' 
                      ? 'bg-ngo text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'sponsor' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Input 
              placeholder="Napisz wiadomość..." 
              className="flex-grow"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Wysyłanie...
                </>
              ) : 'Wyślij'}
            </Button>
          </div>
          
          <div className="flex justify-between mt-6">
            {collaboration.status === 'Przesłana' && userType === 'organization' && (
              <>
                <Button variant="outline" className="flex items-center">
                  <XCircle size={16} className="mr-2" /> Odrzuć
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" className="flex items-center">
                    <Edit size={16} className="mr-2" /> Zaproponuj zmiany
                  </Button>
                  <Button className="flex items-center btn-gradient">
                    <CheckCircle size={16} className="mr-2" /> Akceptuj
                  </Button>
                </div>
              </>
            )}
            
            {collaboration.status === 'Negocjacje' && (
              <Button className="ml-auto btn-gradient">
                <CheckCircle size={16} className="mr-2" /> Akceptuj warunki
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
