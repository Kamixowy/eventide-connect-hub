import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building, User } from 'lucide-react';
import { CollaborationType } from '@/types/collaboration';
import { CollaborationDialog } from './CollaborationDialog';
import { COLLABORATION_STATUS_NAMES, COLLABORATION_STATUS_COLORS } from '@/services/collaborations/types';

interface CollaborationCardListProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardList = ({ collaboration, userType }: CollaborationCardListProps) => {
  // Safely get event title
  const eventTitle = collaboration.events?.title || 
    (collaboration.event ? collaboration.event.title : 'Bez tytułu');
  
  // Safely get event date
  const eventDate = collaboration.events?.start_date || 
    (collaboration.event ? collaboration.event.date : null);
  
  // Safely get organization name
  const organizationName = collaboration.organization?.name || 
    (collaboration.event ? collaboration.event.organization : 'Nieznana organizacja');
  
  // Safely get sponsor name
  let sponsorName = 'Nieznany sponsor';
  if (collaboration.profiles && Array.isArray(collaboration.profiles) && collaboration.profiles.length > 0) {
    sponsorName = collaboration.profiles[0].name || 'Nieznany sponsor';
  } else if (collaboration.sponsor) {
    sponsorName = collaboration.sponsor.name || 'Nieznany sponsor';
  }
  
  // Get badge color for status
  const statusColor = COLLABORATION_STATUS_COLORS[collaboration.status] || 'gray';
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`bg-${statusColor}-100 text-${statusColor}-700 border-${statusColor}-300`}>
                {COLLABORATION_STATUS_NAMES[collaboration.status] || 'Nieznany status'}
              </Badge>
              <h3 className="text-lg font-medium">{eventTitle}</h3>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              {eventDate && (
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  {eventDate}
                </div>
              )}
              
              <div className="flex items-center">
                <Building size={14} className="mr-2" />
                {organizationName}
              </div>
              
              <div className="flex items-center">
                <User size={14} className="mr-2" />
                {sponsorName}
              </div>
            </div>
            
            {collaboration.message && (
              <p className="text-sm text-gray-600 line-clamp-1">{collaboration.message}</p>
            )}
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <CollaborationDialog collaboration={collaboration} userType={userType}>
              <Button variant="outline" size="sm">
                Dialog
              </Button>
            </CollaborationDialog>
            
            <Link to={`/wspolprace/${collaboration.id}`}>
              <Button className="btn-gradient" size="sm">
                Szczegóły
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
