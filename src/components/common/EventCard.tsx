
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EventStatus from '@/components/common/EventStatus';
import { formatDate, formatDateRange } from '@/utils/dateUtils';

export interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    start_date: string;
    end_date?: string | null;
    location?: string;
    expected_participants?: number;
    category?: string;
    status?: string;
    organizations?: { name?: string };
  };
  showOrgName?: boolean;
}

const EventCard = ({ event, showOrgName = false }: EventCardProps) => {
  // Format number with space as thousands separator
  const formatParticipants = (num?: number) => {
    if (!num) return '0';
    return num >= 1000 ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : num.toString();
  };

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = '/placeholder.svg'; 
            }}
          />
        ) : (
          <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
            <Calendar size={48} className="text-gray-300" />
          </div>
        )}
        {event.category && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-ngo text-white">{event.category}</Badge>
          </div>
        )}
        {event.status && (
          <div className="absolute bottom-3 left-3">
            <EventStatus status={event.status} />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
        {showOrgName && event.organizations && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
            {event.organizations.name || 'Nieznana organizacja'}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-2 text-ngo" /> 
            <span>{formatDateRange(event.start_date, event.end_date)}</span>
          </div>
          {event.location && (
            <div className="flex items-center text-sm">
              <MapPin size={16} className="mr-2 text-ngo" /> 
              <span>{event.location}</span>
            </div>
          )}
          {event.expected_participants && (
            <div className="flex items-center text-sm">
              <Users size={16} className="mr-2 text-ngo" /> 
              <span>Planowana liczba uczestników: {formatParticipants(event.expected_participants)}</span>
            </div>
          )}
        </div>
        
        <Link to={`/wydarzenia/${event.id}`}>
          <Button variant="outline" className="w-full">Zobacz szczegóły</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventCard;
