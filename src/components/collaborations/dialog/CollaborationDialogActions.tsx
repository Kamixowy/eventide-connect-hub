
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, MessageSquare, AlertCircle } from "lucide-react";
import { CollaborationStatus } from "@/services/collaborations/types";

interface CollaborationDialogActionsProps {
  status: CollaborationStatus;
  userType: 'organization' | 'sponsor';
  onStatusChange: (newStatus: CollaborationStatus) => void;
  counterOfferMessage?: string;
  onCounterOfferChange?: (message: string) => void;
}

const CollaborationDialogActions = ({
  status,
  userType,
  onStatusChange,
  counterOfferMessage,
  onCounterOfferChange
}: CollaborationDialogActionsProps) => {
  if (userType === 'organization') {
    switch (status) {
      case 'pending':
        return (
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onStatusChange('rejected')}
              className="text-red-600"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Odrzuć
            </Button>
            <Button 
              variant="outline"
              onClick={() => onStatusChange('negotiation')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Negocjuj
            </Button>
            <Button 
              className="btn-gradient"
              onClick={() => onStatusChange('accepted')}
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
              onChange={(e) => onCounterOfferChange?.(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => onStatusChange('rejected')}
                className="text-red-600"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Odrzuć
              </Button>
              <Button 
                className="btn-gradient"
                onClick={() => onStatusChange('accepted')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Zaakceptuj warunki
              </Button>
            </div>
          </div>
        );
    }
  } else if (userType === 'sponsor') {
    switch (status) {
      case 'negotiation':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Wpisz swoją odpowiedź..."
              value={counterOfferMessage}
              onChange={(e) => onCounterOfferChange?.(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline"
                onClick={() => onStatusChange('canceled')}
                className="text-red-600"
              >
                Anuluj współpracę
              </Button>
              <Button 
                className="btn-gradient"
                onClick={() => onStatusChange('pending')}
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
              onClick={() => onStatusChange('canceled')}
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
        Ta współpraca została {status === 'completed' ? 'zakończona' : 
          status === 'rejected' ? 'odrzucona' : 'anulowana'}
      </span>
    </div>
  );
};

export default CollaborationDialogActions;
