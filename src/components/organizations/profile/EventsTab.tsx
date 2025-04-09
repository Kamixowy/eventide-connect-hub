
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, isPast } from 'date-fns';
import { pl } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import EventCard from '@/components/common/EventCard';
import EventStatus from '@/components/common/EventStatus';

interface Event {
  id: string;
  title: string;
  date: string;
  image: string;
  raw_date?: string;
  post_count?: number;
  status?: string;
  category?: string;
  isCurrentUserOrg?: boolean;
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
        // For demo data, mark events as belonging to current user if isOwner is true
        const upcomingWithOwnership = (organization.upcomingEvents || []).map((event: Event) => ({
          ...event,
          isCurrentUserOrg: isOwner
        }));

        const pastWithOwnership = (organization.pastEvents || []).map((event: Event) => ({
          ...event,
          isCurrentUserOrg: isOwner
        }));

        setUpcomingEvents(upcomingWithOwnership);
        setPastEvents(pastWithOwnership);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Pobieramy wydarzenia z Supabase dla tej organizacji
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('id, title, start_date, image_url, description, status, category')
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
          // Pobierz liczbę postów dla wydarzenia - use any type to bypass type checking
          const { count: postCount, error: countError } = await (supabase
            .from('event_posts' as any)
            .select('id', { count: 'exact', head: true })
            .eq('event_id', event.id) as any);
            
          if (countError) {
            console.error('Error fetching post count:', countError);
          }

          const formattedEvent = {
            id: event.id,
            title: event.title,
            date: formatEventDate(event.start_date),
            image: event.image_url || '/placeholder.svg',
            raw_date: event.start_date,
            post_count: postCount || 0,
            status: event.status || 'Planowane',
            category: event.category,
            isCurrentUserOrg: isOwner // Mark as owner's event if they own the organization
          };

          // Sprawdzenie czy wydarzenie ma status "Zakończone", "Anulowane" lub jest przeszłe
          if (event.status === 'Zakończone' || event.status === 'Anulowane' || isPast(new Date(event.start_date))) {
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
  }, [organization.id, isOwner]);

  const convertEventForCard = (event: Event) => {
    return {
      id: event.id,
      title: event.title,
      description: "",
      start_date: event.raw_date || new Date().toISOString(),
      image_url: event.image,
      status: event.status,
      category: event.category,
      isCurrentUserOrg: event.isCurrentUserOrg
    };
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Nadchodzące wydarzenia</h2>
        
        {loading ? (
          <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event: Event) => (
              <Link to={`/wydarzenia/${event.id}`} key={event.id} className="block h-full">
                <EventCard event={convertEventForCard(event)} />
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
              <Link to={`/wydarzenia/${event.id}`} key={event.id} className="block h-full">
                <div className="relative h-full">
                  <EventCard event={{...convertEventForCard(event), status: event.status}} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge variant="outline" className="bg-white text-black">
                      {event.status === 'Anulowane' ? 'Anulowane' : 'Zakończone'}
                    </Badge>
                  </div>
                </div>
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
