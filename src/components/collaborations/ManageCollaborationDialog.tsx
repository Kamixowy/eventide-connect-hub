
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CollaborationType } from "@/types/collaboration";
import { updateCollaborationStatus } from "@/services/collaborations";
import { CollaborationStatus } from "@/services/collaborations/types";
import CollaborationDialogActions from "./dialog/CollaborationDialogActions";
import CollaborationPartnerInfo from "./dialog/CollaborationPartnerInfo";
import CollaborationOptionsList from "./dialog/CollaborationOptionsList";

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

  const handleStatusChange = async (newStatus: CollaborationStatus) => {
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

  // Convert string status to CollaborationStatus type
  const typedStatus = collaboration.status as CollaborationStatus;

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
              {typedStatus === 'pending' ? 'Oczekująca' :
               typedStatus === 'negotiation' ? 'W negocjacji' :
               typedStatus === 'accepted' ? 'Zaakceptowana' :
               typedStatus === 'rejected' ? 'Odrzucona' :
               typedStatus === 'completed' ? 'Zakończona' :
               typedStatus === 'canceled' ? 'Anulowana' : 
               'Nieznany'}
            </span>
          </div>

          {/* Organization & Sponsor Info */}
          <CollaborationPartnerInfo 
            collaboration={collaboration} 
            userType={userType} 
          />

          {/* Sponsorship Options */}
          <CollaborationOptionsList collaboration={collaboration} />

          {/* Actions */}
          <div className="pt-4 border-t">
            <CollaborationDialogActions
              status={typedStatus}
              userType={userType}
              onStatusChange={handleStatusChange}
              counterOfferMessage={counterOfferMessage}
              onCounterOfferChange={setCounterOfferMessage}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCollaborationDialog;
