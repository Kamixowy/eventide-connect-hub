
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { CollaborationDialog } from './CollaborationDialog';
import { CollaborationType } from '@/types/collaboration';
import { COLLABORATION_STATUS_NAMES, COLLABORATION_STATUS_COLORS } from '@/services/collaborations/utils';

interface CollaborationCardListProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardList = ({ collaboration, userType }: CollaborationCardListProps) => {
  // Early return if collaboration is invalid
  if (!collaboration) {
    console.error('Invalid collaboration data:', collaboration);
    return null;
  }

  // Format date for display
  const formatDate = (date: string) => {
    if (!date) return 'Nie określono';
    try {
      return new Date(date).toLocaleDateString('pl-PL');
    } catch (e) {
      return date;
    }
  };

  // Get status information
  const statusName = COLLABORATION_STATUS_NAMES[collaboration.status] || 'Nieznany status';
  const statusColor = COLLABORATION_STATUS_COLORS[collaboration.status] || 'gray';

  // Get partner name based on user type
  let partnerName = 'Nieznany partner';
  let partnerImage = '/placeholder.svg';
  let partnerInitials = 'UN';
  
  if (userType === 'organization') {
    // For organizations, get the sponsor name
    if (collaboration.profiles && Array.isArray(collaboration.profiles) && collaboration.profiles.length > 0) {
      partnerName = collaboration.profiles[0].name || 'Nieznany sponsor';
      partnerImage = collaboration.profiles[0].avatar_url || '/placeholder.svg';
      partnerInitials = partnerName.substring(0, 2);
    } else if (collaboration.sponsor) {
      partnerName = collaboration.sponsor.name || 'Nieznany sponsor';
      partnerImage = collaboration.sponsor.avatar || '/placeholder.svg';
      partnerInitials = partnerName.substring(0, 2);
    }
  } else {
    // For sponsors, get the organization name
    if (collaboration.organization) {
      partnerName = collaboration.organization.name || 'Nieznana organizacja';
      partnerImage = collaboration.organization.logo_url || '/placeholder.svg';
      partnerInitials = partnerName.substring(0, 2);
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

  // Get created date from either field
  const createdAt = collaboration.created_at 
    ? formatDate(collaboration.created_at) 
    : (collaboration.createdAt || 'Nie określono');

  // Get total amount from either field
  const totalAmount = collaboration.total_amount || collaboration.totalAmount || 0;

  // Provide empty array if sponsorshipOptions doesn't exist
  const sponsorshipOptions = collaboration.sponsorshipOptions || [];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/4 overflow-hidden">
          <img 
            src={eventImage} 
            alt={eventTitle} 
            className="object-cover w-full h-full"
          />
          <div className={`
            absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium
            bg-${statusColor}-100 text-${statusColor}-700
          `}>
            {statusName}
          </div>
        </div>
        <CardContent className="p-4 md:p-6 md:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="font-semibold text-lg md:text-xl mb-2">{eventTitle}</h3>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={partnerImage} alt={partnerName} />
                  <AvatarFallback>{partnerInitials}</AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground text-sm">
                  {partnerName}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <p className="font-medium mb-1">Kwota: {totalAmount} PLN</p>
              <p className="text-sm text-muted-foreground mb-2">Ostatnia aktualizacja: {lastUpdated}</p>
              <CollaborationDialog 
                collaboration={{
                  ...collaboration,
                  sponsorshipOptions: sponsorshipOptions
                }} 
                userType={userType}
              >
                <Button variant="outline">
                  <MessageSquare size={16} className="mr-2" /> Konwersacja
                </Button>
              </CollaborationDialog>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center text-sm">
              <Calendar size={16} className="mr-2 text-ngo" /> 
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-2 text-ngo" /> 
              <span>Utworzono: {createdAt}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Opcje współpracy:</p>
            <div className="flex flex-wrap gap-2">
              {sponsorshipOptions && sponsorshipOptions.map((option, index) => (
                <Badge key={index} variant="outline">
                  {option.title}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
