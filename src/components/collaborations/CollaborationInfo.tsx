
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Building, User } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface CollaborationInfoProps {
  collaboration: any;
  userType: 'organization' | 'sponsor';
}

const CollaborationInfo = ({ collaboration, userType }: CollaborationInfoProps) => {
  // Get partner name based on user type
  let partnerName = 'Nieznany partner';
  let organizationName = 'Nieznana organizacja';
  
  if (userType === 'organization') {
    // For organizations, get the sponsor name
    if (collaboration.profiles && Array.isArray(collaboration.profiles) && collaboration.profiles.length > 0) {
      partnerName = collaboration.profiles[0].name || 'Nieznany sponsor';
    } else if (collaboration.sponsor) {
      partnerName = collaboration.sponsor.name || 'Nieznany sponsor';
    }
    
    // Get organization name
    organizationName = collaboration.organization?.name || 'Twoja organizacja';
  } else {
    // For sponsors, get the organization name
    if (collaboration.organization) {
      organizationName = collaboration.organization.name || 'Nieznana organizacja';
    }
    
    // Sponsor is the current user
    partnerName = 'Ty';
  }
  
  // Format dates - now passing directly with updated formatDate function
  const eventDate = collaboration.events?.start_date ? 
    formatDate(collaboration.events.start_date) : 
    (collaboration.event?.date || 'Nie określono');
  
  const createdDate = collaboration.created_at ? 
    formatDate(collaboration.created_at) : 
    'Nie określono';
  
  const updatedDate = collaboration.updated_at ? 
    formatDate(collaboration.updated_at) : 
    'Nie określono';
  
  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4">Informacje</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar size={20} className="text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Data wydarzenia</p>
            <p className="font-medium">{eventDate}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Utworzono</p>
            <p className="font-medium">{createdDate}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Ostatnia aktualizacja</p>
            <p className="font-medium">{updatedDate}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Building size={20} className="text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Organizacja</p>
            <p className="font-medium">{organizationName}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <User size={20} className="text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Sponsor</p>
            <p className="font-medium">{partnerName}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CollaborationInfo;
