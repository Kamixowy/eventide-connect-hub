
import { CollaborationType } from '@/types/collaboration';
import { Card } from '@/components/ui/card';
import { ManageCollaborationDialog } from './ManageCollaborationDialog';

interface CollaborationCardGridProps {
  collaborations: CollaborationType[];
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardGrid = ({ collaborations, userType }: CollaborationCardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collaborations.map((collaboration) => (
        <ManageCollaborationDialog 
          key={collaboration.id}
          collaboration={collaboration}
          userType={userType}
        >
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium truncate">
                  {collaboration.events?.title || 'Brak nazwy wydarzenia'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {collaboration.organization?.name || 'Brak organizacji'}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
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
