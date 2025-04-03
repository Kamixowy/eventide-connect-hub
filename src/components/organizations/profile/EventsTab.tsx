
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isPast } from 'date-fns';
import { pl } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

interface Event {
  id: string;
  title: string;
  date: string;
  image: string;
  raw_date?: string;
  post_count?: number;
}

interface EventsTabProps {
  organization: any;
  isOwner: boolean;
}

const EventsTab: React.FC<EventsTabProps> = ({ organization, isOwner }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Funkcja formatująca datę dla wyświetlenia
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: pl });
  };

  useEffect(() => {
    const fetchOrganizationEvents = async () => {
      if (!organization.id) {
        // Jeśli nie ma ID organizacji, używamy przykładowych danych
        setUpcomingEvents(organization.upcomingEvents || []);
        setPastEvents(organization.pastEvents || []);
        setLoading(false);
        return;
      }

      // Sprawdzenie, czy to jest demo użytkownik
      if (organization.id.startsWith('demo-') || organization.id === '101') {
        setUpcomingEvents(organization.upcomingEvents || []);
        setPastEvents(organization.pastEvents || []);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Pobieramy wydarzenia z Supabase dla tej organizacji
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('id, title, start_date, image_url, description')
          .eq('organization_id', organization.id)
          .order('start_date', { ascending: true });

        if (error) {
          console.error('Error fetching events:', error);
          setLoading(false);
          return;
        }

        // Przetwarzanie danych i podział na przeszłe i przyszłe wydarzenia
        const past: Event[] = [];
        const upcoming: Event[] = [];

        // Pobierz liczby postów dla każdego wydarzenia
        for (const event of eventsData) {
          // Pobierz liczbę postów dla wydarzenia
          const { count: postCount, error: countError } = await supabase
            .from('event_posts')
            .select('id', { count: 'exact', head: true })
            .eq('event_id', event.id);
            
          if (countError) {
            console.error('Error fetching post count:', countError);
          }

          const formattedEvent = {
            id: event.id,
            title: event.title,
            date: formatEventDate(event.start_date),
            image: event.image_url || '/placeholder.svg',
            raw_date: event.start_date,
            post_count: postCount || 0
          };

          // Sprawdzenie czy wydarzenie jest przeszłe czy przyszłe
          if (isPast(new Date(event.start_date))) {
            past.push(formattedEvent);
          } else {
            upcoming.push(formattedEvent);
          }
        }

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error('Error in fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationEvents();
  }, [organization.id]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Nadchodzące wydarzenia</h2>
        
        {loading ? (
          <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event: Event) => (
              <Link to={`/wydarzenia/${event.id}`} key={event.id}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src = '/placeholder.svg'; 
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-ngo" /> 
                      <span>{event.date}</span>
                    </div>
                  </CardContent>
                  {typeof event.post_count !== 'undefined' && (
                    <CardFooter className="p-4 pt-0">
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare size={16} className="mr-1" />
                        <span>{event.post_count} {event.post_count === 1 ? 'post' : 'posty'}</span>
                      </div>
                    </CardFooter>
                  )}
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
        
        {loading ? (
          <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
        ) : pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event: Event) => (
              <Link to={`/wydarzenia/${event.id}`} key={event.id}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src = '/placeholder.svg'; 
                      }}
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
                  {typeof event.post_count !== 'undefined' && (
                    <CardFooter className="p-4 pt-0">
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare size={16} className="mr-1" />
                        <span>{event.post_count} {event.post_count === 1 ? 'post' : 'posty'}</span>
                      </div>
                    </CardFooter>
                  )}
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
