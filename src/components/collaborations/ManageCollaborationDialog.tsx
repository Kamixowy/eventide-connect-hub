
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock,
  AlertCircle
} from "lucide-react";
import { CollaborationType } from "@/types/collaboration";
import { updateCollaborationStatus } from "@/services/collaborations";

interface ManageCollaborationDialogProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
  children: React.ReactNode;
  onStatusUpdate?: () => void;
}

export const ManageCollaborationDialog = ({
  collaboration,
  userType,
  children,
  onStatusUpdate
}: ManageCollaborationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [counterOfferMessage, setCounterOfferMessage] = useState('');
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateCollaborationStatus(collaboration.id, newStatus);
      toast({
        title: "Status zaktualizowany",
        description: "Status współpracy został zmieniony pomyślnie."
      });
      setIsOpen(false);
      onStatusUpdate?.();
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować statusu",
        variant: "destructive"
      });
    }
  };

  const getStatusActions = () => {
    if (userType === 'organization') {
      switch (collaboration.status) {
        case 'pending':
          return (
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('rejected')}
                className="text-red-600"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Odrzuć
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleStatusChange('negotiation')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Negocjuj
              </Button>
              <Button 
                className="btn-gradient"
                onClick={() => handleStatusChange('accepted')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Zaakceptuj
              </Button>
            </div>
          );
        case 'negotiation':
          return (
            <div className="space-y-4">
              <Textarea
                placeholder="Wpisz swoją kontrofertę..."
                value={counterOfferMessage}
                onChange={(e) => setCounterOfferMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('rejected')}
                  className="text-red-600"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Odrzuć
                </Button>
                <Button 
                  className="btn-gradient"
                  onClick={() => handleStatusChange('accepted')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Zaakceptuj warunki
                </Button>
              </div>
            </div>
          );
      }
    } else if (userType === 'sponsor') {
      switch (collaboration.status) {
        case 'negotiation':
          return (
            <div className="space-y-4">
              <Textarea
                placeholder="Wpisz swoją odpowiedź..."
                value={counterOfferMessage}
                onChange={(e) => setCounterOfferMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => handleStatusChange('canceled')}
                  className="text-red-600"
                >
                  Anuluj współpracę
                </Button>
                <Button 
                  className="btn-gradient"
                  onClick={() => handleStatusChange('pending')}
                >
                  Wyślij odpowiedź
                </Button>
              </div>
            </div>
          );
        case 'pending':
          return (
            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={() => handleStatusChange('canceled')}
                className="text-red-600"
              >
                Anuluj propozycję
              </Button>
            </div>
          );
      }
    }
    
    // For completed/rejected/canceled statuses
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
        <AlertCircle className="w-5 h-5 mr-2 text-gray-500" />
        <span className="text-gray-600">
          Ta współpraca została {collaboration.status === 'completed' ? 'zakończona' : 
            collaboration.status === 'rejected' ? 'odrzucona' : 'anulowana'}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Szczegóły współpracy</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({collaboration.events?.title})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">
              {collaboration.status === 'pending' ? 'Oczekująca' :
               collaboration.status === 'negotiation' ? 'W negocjacji' :
               collaboration.status === 'accepted' ? 'Zaakceptowana' :
               collaboration.status === 'rejected' ? 'Odrzucona' :
               collaboration.status === 'completed' ? 'Zakończona' :
               collaboration.status === 'canceled' ? 'Anulowana' : 
               'Nieznany'}
            </span>
          </div>

          {/* Organization & Sponsor Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Organizacja</h3>
              <div className="p-4 border rounded-lg">
                <p className="font-medium">{collaboration.organization?.name || 'Brak nazwy'}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {collaboration.organization?.description || 'Brak opisu'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Sponsor</h3>
              <div className="p-4 border rounded-lg">
                <p className="font-medium">
                  {collaboration.profiles?.[0]?.name || collaboration.sponsor?.name || 'Brak nazwy'}
                </p>
              </div>
            </div>
          </div>

          {/* Sponsorship Options */}
          <div>
            <h3 className="text-sm font-medium mb-2">Wybrane opcje sponsoringu</h3>
            <div className="space-y-2">
              {collaboration.options?.map((option: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{option.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {option.description || 'Brak opisu'}
                      </p>
                    </div>
                    <p className="font-bold">{option.amount} PLN</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            {getStatusActions()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
