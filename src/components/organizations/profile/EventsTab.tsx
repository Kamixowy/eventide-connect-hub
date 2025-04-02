
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventsTabProps {
  organization: any;
  isOwner: boolean;
}

const EventsTab: React.FC<EventsTabProps> = ({ organization, isOwner }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Nadchodzące wydarzenia</h2>
        
        {organization.upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organization.upcomingEvents.map((event: any) => (
              <Link to={`/wydarzenia/${event.id}`} key={event.id}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-ngo" /> 
                      <span>{event.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Nie ma żadnych nadchodzących wydarzeń.
          </p>
        )}
        
        {isOwner && (
          <div className="mt-6">
            <Link to="/dodaj-wydarzenie">
              <Button>
                <Plus size={16} className="mr-2" /> Dodaj nowe wydarzenie
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Poprzednie wydarzenia</h2>
        
        {organization.pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organization.pastEvents.map((event: any) => (
              <Link to={`/wydarzenia/${event.id}`} key={event.id}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge variant="outline" className="bg-white text-black">
                        Zakończone
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-ngo" /> 
                      <span>{event.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Nie ma żadnych poprzednich wydarzeń.
          </p>
        )}
      </div>
    </>
  );
};

export default EventsTab;
