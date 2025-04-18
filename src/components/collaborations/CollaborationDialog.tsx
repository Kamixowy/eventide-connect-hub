
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { CheckCircle, Edit, XCircle } from 'lucide-react';
import { CollaborationType } from '@/types/collaboration';
import { ReactNode } from 'react';

interface CollaborationDialogProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
  children: ReactNode;
}

export const CollaborationDialog = ({ collaboration, userType, children }: CollaborationDialogProps) => {
  // Get event details, accounting for different data structures
  const eventTitle = collaboration.events?.title || 
    (collaboration.event ? collaboration.event.title : 'Bez tytułu');

  // Get partner name based on user type
  let partnerName = 'Nieznany partner';
  
  if (userType === 'organization') {
    // For organizations, get the sponsor name
    if (collaboration.profiles && Array.isArray(collaboration.profiles) && collaboration.profiles.length > 0) {
      partnerName = collaboration.profiles[0].name || 'Nieznany sponsor';
    } else if (collaboration.sponsor) {
      partnerName = collaboration.sponsor.name || 'Nieznany sponsor';
    }
  } else {
    // For sponsors, get the organization name
    if (collaboration.organization) {
      partnerName = collaboration.organization.name || 'Nieznana organizacja';
    }
  }

  // Safely get the total amount
  const totalAmount = collaboration.total_amount || collaboration.totalAmount || 0;

  // Provide empty arrays if sponsorshipOptions or conversation doesn't exist
  const sponsorshipOptions = collaboration.sponsorshipOptions || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Szczegóły współpracy</DialogTitle>
          <DialogDescription>
            {eventTitle} - {collaboration.status}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Organizacja</p>
            <p className="font-medium">
              {collaboration.organization?.name || 
               (collaboration.event?.organization || 'Nieznana organizacja')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sponsor</p>
            <p className="font-medium">{partnerName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Wartość</p>
            <p className="font-medium">{totalAmount} PLN</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Opcje współpracy</h3>
          <div className="space-y-2">
            {sponsorshipOptions.map((option, index) => (
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
      </DialogContent>
    </Dialog>
  );
};
