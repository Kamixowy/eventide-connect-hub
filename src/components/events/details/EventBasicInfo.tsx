
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateRange } from '@/utils/dateUtils';
interface EventBasicInfoProps {
  organization: {
    id: string | number;
    name: string;
    avatar: string | null;
  };
  date: string;
  startDate: string;
  endDate?: string | null;
  location: string;
  detailed_location?: string;
  attendees: number;
}
const EventBasicInfo: React.FC<EventBasicInfoProps> = ({
  organization,
  date,
  startDate,
  endDate,
  location,
  detailed_location,
  attendees
}) => {
  // Format number with space as thousands separator
  const formatParticipants = (num: number) => {
    return num >= 1000 ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : num.toString();
  };

  return <>
      <Link to={`/organizacje/${organization.id}`} className="flex items-center mb-6 hover:text-ngo transition-colors">
        <Avatar className="h-12 w-12 mr-3">
          <AvatarImage src={organization.avatar || undefined} alt={organization.name} />
          <AvatarFallback>{organization.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">Organizator</p>
          <h3 className="font-semibold">{organization.name}</h3>
        </div>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center border rounded-lg p-4">
          <Calendar size={24} className="mr-3 text-ngo" /> 
          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="font-medium">
              {endDate ? formatDateRange(startDate, endDate) : date}
            </p>
          </div>
        </div>
        <div className="flex items-center border rounded-lg p-4">
          <MapPin size={24} className="mr-3 text-ngo" /> 
          <div>
            <p className="text-sm text-muted-foreground">Lokalizacja</p>
            <p className="font-medium">{location}</p>
            {detailed_location && (
              <p className="text-sm text-muted-foreground mt-1">{detailed_location}</p>
            )}
          </div>
        </div>
        <div className="flex items-center border rounded-lg p-4">
          <Users size={24} className="mr-3 text-ngo" /> 
          <div>
            <p className="text-sm text-muted-foreground">Planowani uczestnicy
          </p>
            <p className="font-medium">{formatParticipants(attendees)} osób</p>
          </div>
        </div>
      </div>
    </>;
};
export default EventBasicInfo;
