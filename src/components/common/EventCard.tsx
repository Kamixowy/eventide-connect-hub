
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
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
    isCurrentUserOrg?: boolean;
  };
  showOrgName?: boolean;
}

const EventCard = ({ event, showOrgName = false }: EventCardProps) => {
  return (
    <Card className={`overflow-hidden h-full transition-all hover:shadow-md ${event.isCurrentUserOrg ? 'border-ngo border-2' : ''}`}>
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
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
          {event.isCurrentUserOrg && (
            <Badge className="bg-ngo hover:bg-ngo">
              <CheckCircle className="h-3 w-3 mr-1" /> Twoje
            </Badge>
          )}
        </div>
        
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
              <span>Przewidywana liczba uczestników: {event.expected_participants}</span>
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
