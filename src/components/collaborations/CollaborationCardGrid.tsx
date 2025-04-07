
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
  // Early return if collaboration is invalid
  if (!collaboration) {
    console.error('Invalid collaboration data:', collaboration);
    return null;
  }

  console.log('Rendering collaboration card:', collaboration, 'User type:', userType);

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

  // Get partner name based on user type
  let partnerName = 'Nieznany partner';
  let partnerImage = '/placeholder.svg';
  
  if (userType === 'organization') {
    // For organizations, get the sponsor name
    if (collaboration.profiles && Array.isArray(collaboration.profiles) && collaboration.profiles.length > 0) {
      partnerName = collaboration.profiles[0].name || 'Nieznany sponsor';
      partnerImage = collaboration.profiles[0].avatar_url || '/placeholder.svg';
    } else if (collaboration.sponsor) {
      partnerName = collaboration.sponsor.name || 'Nieznany sponsor';
      partnerImage = collaboration.sponsor.avatar || '/placeholder.svg';
    }
  } else {
    // For sponsors, get the organization name
    if (collaboration.organization) {
      partnerName = collaboration.organization.name || 'Nieznana organizacja';
      partnerImage = collaboration.organization.logo_url || '/placeholder.svg';
    }
  }

  // Handle both data structures for event details
  const eventTitle = collaboration.events?.title || collaboration.event?.title || 'Bez tytułu';
  const eventImage = collaboration.events?.image_url || collaboration.event?.image || '/placeholder.svg';
  const eventDate = collaboration.events?.start_date 
    ? formatDate(collaboration.events.start_date) 
    : (collaboration.events?.date || collaboration.event?.date || 'Nie określono');
  
  // Get last updated date from either field
  const lastUpdated = collaboration.updated_at 
    ? formatDate(collaboration.updated_at) 
    : (collaboration.lastUpdated || 'Nie określono');

  // Get total amount from either field
  const totalAmount = collaboration.total_amount || collaboration.totalAmount || 0;

  // Provide empty array if sponsorshipOptions doesn't exist
  const sponsorshipOptions = collaboration.sponsorshipOptions || [];
  const conversation = collaboration.conversation || [];

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={eventImage} 
          alt={eventTitle || 'Wydarzenie'} 
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
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{eventTitle}</h3>
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
            <span>Kwota: {totalAmount} PLN</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <CollaborationDialog 
            collaboration={{
              ...collaboration,
              sponsorshipOptions,
              conversation
            }} 
            userType={userType}
          >
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
