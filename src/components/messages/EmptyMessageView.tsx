
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Conversation } from '@/services/messages';

interface EmptyMessageViewProps {
  isLoading: boolean;
  conversationsCount: number;
  isError?: boolean;
  onRefetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<Conversation[], Error>>;
}

const EmptyMessageView = ({ 
  isLoading, 
  conversationsCount, 
  isError = false,
  onRefetch
}: EmptyMessageViewProps) => {
  const { user } = useAuth();
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [testCreated, setTestCreated] = useState(false);

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
              <p className="mb-4">Konwersacje są dostępne w ramach współprac. Aby rozpocząć konwersację, utwórz propozycję współpracy.</p>
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
