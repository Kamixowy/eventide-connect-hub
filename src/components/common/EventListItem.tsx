
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EventStatus from '@/components/common/EventStatus';
import { formatDateRange } from '@/utils/dateUtils';
import type { EventCardProps } from './EventCard';

const EventListItem = ({ event, showOrgName = false }: EventCardProps) => {
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          <div className="relative h-32 md:w-48 overflow-hidden rounded">
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
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <Calendar size={48} className="text-gray-300" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                {showOrgName && event.organizations && (
                  <p className="text-muted-foreground text-sm">
                    {event.organizations.name || 'Nieznana organizacja'}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {event.category && (
                  <Badge className="bg-ngo text-white">{event.category}</Badge>
                )}
                {event.status && (
                  <EventStatus status={event.status} />
                )}
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-1 md:space-y-0 md:space-x-6 md:flex">
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
                    <span>Uczestnicy: {event.expected_participants}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0">
                <Link to={`/wydarzenia/${event.id}`}>
                  <Button variant="outline">Zobacz szczegóły</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventListItem;
