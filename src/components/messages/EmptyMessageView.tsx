
import { Loader2, Plus, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface EmptyMessageViewProps {
  isLoading: boolean;
  conversationsCount: number;
  onNewMessageClick: () => void;
  isError?: boolean;
  onRefetch?: () => void;
  onCreateTestConversation?: (email: string) => Promise<string | null>;
}

const EmptyMessageView = ({ 
  isLoading, 
  conversationsCount, 
  onNewMessageClick, 
  isError = false,
  onRefetch,
  onCreateTestConversation
}: EmptyMessageViewProps) => {
  const { user } = useAuth();
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [testCreated, setTestCreated] = useState(false);
  
  const handleCreateTestConversation = async () => {
    if (!user || !onCreateTestConversation) return;
    
    setIsCreatingTest(true);
    try {
      // Using the email from props for the test user
      const conversationId = await onCreateTestConversation('iuh15406@jioso.com');
      if (conversationId) {
        setTestCreated(true);
        if (onRefetch) {
          setTimeout(() => {
            onRefetch();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error creating test conversation:', error);
    } finally {
      setIsCreatingTest(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-ngo" />
          <p>Ładowanie konwersacji...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-lg font-medium mb-2">Błąd wczytywania</p>
          <p className="mb-4">Wystąpił problem podczas wczytywania konwersacji.</p>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Odśwież stronę
            </Button>
            {onRefetch && (
              <Button 
                variant="default"
                onClick={onRefetch}
              >
                <RefreshCcw size={16} className="mr-1" /> Ponów próbę
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {conversationsCount === 0 ? (
            <div className="max-w-md flex flex-col items-center gap-4">
              <h3 className="text-lg font-medium mb-2">Brak konwersacji</h3>
              <p className="mb-4">Rozpocznij nową konwersację, aby nawiązać kontakt z organizacjami.</p>
              <Button 
                className="btn-gradient" 
                onClick={onNewMessageClick}
              >
                <Plus size={16} className="mr-1" /> Nowa wiadomość
              </Button>
              
              {user?.email === 'iuh15406@jioso.com' && onCreateTestConversation && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50 w-full">
                  <h4 className="text-sm font-semibold mb-2">Opcje testowe</h4>
                  <p className="text-xs mb-3">Możesz utworzyć przykładową konwersację z testowymi danymi.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCreateTestConversation}
                    disabled={isCreatingTest || testCreated}
                    className="w-full"
                  >
                    {isCreatingTest ? (
                      <>
                        <Loader2 size={14} className="mr-1 animate-spin" /> 
                        Tworzenie...
                      </>
                    ) : testCreated ? (
                      "Utworzono testową konwersację!"
                    ) : (
                      "Utwórz testową konwersację"
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            "Wybierz konwersację, aby wyświetlić wiadomości"
          )}
        </>
      )}
    </div>
  );
};

export default EmptyMessageView;
