
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CollaborationType } from '@/types/collaboration';
import { CollaborationDialog } from './CollaborationDialog';
import { COLLABORATION_STATUS_COLORS, COLLABORATION_STATUS_NAMES } from '@/services/collaborations/utils';
import { Calendar, User, Building } from 'lucide-react';

interface CollaborationCardGridProps {
  collaboration: CollaborationType;
  userType: 'organization' | 'sponsor';
}

export const CollaborationCardGrid = ({ collaboration, userType }: CollaborationCardGridProps) => {
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
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 rounded-full text-xs bg-${statusColor}-100 text-${statusColor}-800 border border-${statusColor}-200`}>
            {COLLABORATION_STATUS_NAMES[collaboration.status] || 'Nieznany'}
          </span>
        </div>
        
        <h3 className="text-lg font-medium mb-2 line-clamp-2">{eventTitle}</h3>
        
        <div className="space-y-2 mb-4">
          {eventDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-2" />
              {eventDate}
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Building size={14} className="mr-2" />
            {organizationName}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <User size={14} className="mr-2" />
            {sponsorName}
          </div>
        </div>
        
        {collaboration.message && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 line-clamp-2">{collaboration.message}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between">
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
      </CardFooter>
    </Card>
  );
};
