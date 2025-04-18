
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Edit, XCircle } from 'lucide-react';
import { getAvailableActions } from '@/services/collaborations/utils';
import { CollaborationStatus } from '@/services/collaborations/types';

interface CollaborationActionsProps {
  collaboration: any;
  userType: 'organization' | 'sponsor';
  onStatusChange: (newStatus: CollaborationStatus) => void;
}

const CollaborationActions = ({ 
  collaboration, 
  userType,
  onStatusChange
}: CollaborationActionsProps) => {
  if (!collaboration) return null;
  
  const availableActions = getAvailableActions(collaboration.status, userType);
  
  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4">Akcje</h3>
      
      <div className="space-y-3">
        {availableActions.includes('edit') && (
          <Button className="w-full" variant="outline">
            <Edit size={16} className="mr-2" /> Edytuj
          </Button>
        )}
        
        {availableActions.includes('accept') && (
          <Button 
            className="w-full btn-gradient"
            onClick={() => onStatusChange('accepted')}
          >
            <CheckCircle size={16} className="mr-2" /> Zaakceptuj
          </Button>
        )}
        
        {availableActions.includes('reject') && (
          <Button 
            className="w-full" 
            variant="destructive"
            onClick={() => onStatusChange('rejected')}
          >
            <XCircle size={16} className="mr-2" /> Odrzuć
          </Button>
        )}
        
        {availableActions.includes('negotiate') && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => onStatusChange('negotiation')}
          >
            <Edit size={16} className="mr-2" /> Negocjuj
          </Button>
        )}
        
        {availableActions.includes('complete') && (
          <Button 
            className="w-full"
            variant="default"
            onClick={() => onStatusChange('completed')}
          >
            <CheckCircle size={16} className="mr-2" /> Zakończ
          </Button>
        )}
        
        {availableActions.includes('cancel') && (
          <Button 
            className="w-full" 
            variant="destructive"
            onClick={() => onStatusChange('canceled')}
          >
            Anuluj
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CollaborationActions;
