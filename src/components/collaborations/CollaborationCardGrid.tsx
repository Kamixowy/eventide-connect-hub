
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CollaborationDialog } from './CollaborationDialog';
import { CollaborationType } from '@/types/collaboration';
import { Link } from 'react-router-dom';
import { COLLABORATION_STATUS_NAMES, COLLABORATION_STATUS_COLORS } from '@/services/collaborations/utils';

interface CollaborationCardGridProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardGrid = ({ collaboration, userType }: CollaborationCardGridProps) => {
  if (!collaboration || !collaboration.events) {
    console.error('Invalid collaboration data:', collaboration);
    return null;
  }

  const statusName = COLLABORATION_STATUS_NAMES[collaboration.status] || 'Nieznany status';
  const statusColor = COLLABORATION_STATUS_COLORS[collaboration.status] || 'gray';
  
  // Format date for display
  const formatDate = (date: string) => {
    if (!date) return 'Nie określono';
    try {
      return new Date(date).toLocaleDateString('pl-PL');
    } catch (e) {
      return date;
    }
  };

  // Get organization or sponsor name
  const partnerName = userType === 'organization' 
    ? (collaboration.profiles?.name || 'Nieznany sponsor') 
    : (collaboration.organization?.name || 'Nieznana organizacja');

  const eventImage = collaboration.events?.image_url || '/placeholder.svg';
  const eventDate = collaboration.events?.start_date ? formatDate(collaboration.events.start_date) : 'Nie określono';
  const lastUpdated = collaboration.updated_at ? formatDate(collaboration.updated_at) : 'Nie określono';

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={eventImage} 
          alt={collaboration.events.title || 'Wydarzenie'} 
          className="object-cover w-full h-full"
        />
        <div className={`
          absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
          bg-${statusColor}-100 text-${statusColor}-700 border border-${statusColor}-300
        `}>
          {statusName}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{collaboration.events.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
          {partnerName}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-ngo" /> 
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2 text-ngo" /> 
            <span>Ostatnia aktualizacja: {lastUpdated}</span>
          </div>
          <div className="flex items-center text-sm font-medium">
            <span>Kwota: {collaboration.total_amount} PLN</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <CollaborationDialog collaboration={collaboration} userType={userType}>
            <Button variant="outline" className="w-full">
              <MessageSquare size={16} className="mr-2" /> Konwersacja
            </Button>
          </CollaborationDialog>
          
          <Link to={`/wspolprace/${collaboration.id}`} className="block w-full">
            <Button variant="default" className="w-full">
              Szczegóły
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
