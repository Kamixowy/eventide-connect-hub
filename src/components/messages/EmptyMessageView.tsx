
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyMessageViewProps {
  isLoading: boolean;
  conversationsCount: number;
  onNewMessageClick: () => void;
}

const EmptyMessageView = ({ isLoading, conversationsCount, onNewMessageClick }: EmptyMessageViewProps) => {
  return (
    <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-ngo" />
          <p>Ładowanie konwersacji...</p>
        </div>
      ) : (
        <>
          {conversationsCount === 0 ? (
            <div className="max-w-md">
              <h3 className="text-lg font-medium mb-2">Brak konwersacji</h3>
              <p className="mb-4">Rozpocznij nową konwersację, aby nawiązać kontakt z organizacjami.</p>
              <Button 
                className="btn-gradient" 
                onClick={onNewMessageClick}
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
  );
};

export default EmptyMessageView;
