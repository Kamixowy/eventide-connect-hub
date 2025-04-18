
import { CollaborationType } from '@/types/collaboration';
import { Card } from '@/components/ui/card';
import { ManageCollaborationDialog } from './ManageCollaborationDialog';

interface CollaborationCardListProps {
  collaborations: CollaborationType[];
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardList = ({ collaborations, userType }: CollaborationCardListProps) => {
  return (
    <div className="space-y-4">
      {collaborations.map((collaboration) => (
        <ManageCollaborationDialog 
          key={collaboration.id}
          collaboration={collaboration}
          userType={userType}
        >
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium">
                  {collaboration.events?.title || 'Brak nazwy wydarzenia'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {collaboration.organization?.name || 'Brak organizacji'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {collaboration.total_amount || collaboration.totalAmount || 0} PLN
                </span>
                <span className={`text-sm px-2 py-1 rounded-full 
                  ${collaboration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    collaboration.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    collaboration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    collaboration.status === 'negotiation' ? 'bg-blue-100 text-blue-800' :
                    collaboration.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'}`}
                >
                  {collaboration.status === 'pending' ? 'Oczekująca' :
                   collaboration.status === 'negotiation' ? 'W negocjacji' :
                   collaboration.status === 'accepted' ? 'Zaakceptowana' :
                   collaboration.status === 'rejected' ? 'Odrzucona' :
                   collaboration.status === 'completed' ? 'Zakończona' :
                   collaboration.status === 'canceled' ? 'Anulowana' : 
                   'Nieznany'}
                </span>
              </div>
            </div>
          </Card>
        </ManageCollaborationDialog>
      ))}
    </div>
  );
};
