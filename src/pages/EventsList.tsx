import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useViewPreference } from '@/hooks/useViewPreference';
import EventsFilter, { SortOption, FilterOption } from '@/components/common/EventsFilter';
import EventCard from '@/components/common/EventCard';
import EventListItem from '@/components/common/EventListItem';
import CookieConsent from '@/components/common/CookieConsent';

const EventsList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { viewType, setViewPreference } = useViewPreference('events', 'grid');

  const demoEvents = [
    {
      id: 'evt-1',
      title: 'Maraton Charytatywny',
      description: 'Coroczny maraton charytatywny wspierający lokalne schroniska dla zwierząt.',
      start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Warszawa, Park Miejski',
      expected_participants: 500,
      category: 'Sportowe',
      image_url: null,
      status: 'Planowane'
    },
    {
      id: 'evt-2',
      title: 'Festiwal Kultury',
      description: 'Międzynarodowy festiwal promujący różnorodność kulturową i dziedzictwo.',
      start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Kraków, Rynek Główny',
      expected_participants: 1000,
      category: 'Kulturalne',
      image_url: null,
      status: 'W przygotowaniu'
    },
    {
      id: 'evt-3',
      title: 'Koncert Charytatywny',
      description: 'Koncert wspierający dzieci z domów dziecka. Wystąpią lokalni artyści.',
      start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Wrocław, Hala Stulecia',
      expected_participants: 750,
      category: 'Charytatywne',
      image_url: null,
      status: 'W trakcie'
    },
    {
      id: 'evt-4',
      title: 'Konferencja Ekologiczna',
      description: 'Spotkanie ekspertów i działaczy na rzecz ochrony środowiska naturalnego.',
      start_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Gdańsk, Centrum Konferencyjne',
      expected_participants: 300,
      category: 'Edukacyjne',
      image_url: null,
      status: 'Planowane'
    }
  ];

  const availableFilters = [
    { label: 'Planowane', value: 'Planowane' },
    { label: 'W przygotowaniu', value: 'W przygotowaniu' },
    { label: 'W trakcie', value: 'W trakcie' },
    { label: 'Zakończone', value: 'Zakończone' },
    { label: 'Sportowe', value: 'category:Sportowe' },
    { label: 'Kulturalne', value: 'category:Kulturalne' },
    { label: 'Charytatywne', value: 'category:Charytatywne' },
    { label: 'Edukacyjne', value: 'category:Edukacyjne' },
    { label: 'Społeczne', value: 'category:Społeczne' }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      if (user && user.id.startsWith('demo-')) {
        const markedDemoEvents = demoEvents.map(event => ({
          ...event,
          isCurrentUserOrg: user.id === 'demo-organization' && event.id === 'evt-1'
        }));
        setEvents(markedDemoEvents);
        setLoading(false);
        return;
      }
      
      let userOrgId = null;
      if (user) {
        const { data: userOrg } = await supabase
          .from('organizations')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (userOrg) {
          userOrgId = userOrg.id;
        }
      }

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          organizations(name)
        `)
        .order('start_date', { ascending: true });
        
      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać wydarzeń. Pokazujemy przykładowe dane.",
          variant: "destructive"
        });
        
        const markedDemoEvents = demoEvents.map(event => ({
          ...event,
          isCurrentUserOrg: user?.id === 'demo-organization' && event.id === 'evt-1'
        }));
        
        setEvents(markedDemoEvents);
      } else {
        console.log('Events fetched:', eventsData);
        
        const formattedEvents = eventsData.map(event => ({
          ...event,
          organization: event.organizations?.name || 'Nieznana organizacja',
          isCurrentUserOrg: userOrgId ? event.organization_id === userOrgId : false
        }));
        
        setEvents(formattedEvents.length > 0 ? formattedEvents : demoEvents);
      }
    };
    
    fetchEvents();
  }, [user, toast]);

  const handleEventClick = (eventId: string) => {
    navigate(`/wydarzenia/${eventId}`);
  };

  const sortEvents = (events: any[]) => {
    return [...events].sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        case 'date-desc':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'participants-asc':
          return (a.expected_participants || 0) - (b.expected_participants || 0);
        case 'participants-desc':
          return (b.expected_participants || 0) - (a.expected_participants || 0);
        default:
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      }
    });
  };

  const filterEvents = (events: any[]) => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
        if (filter.startsWith('category:')) {
          const category = filter.replace('category:', '');
          return event.category === category;
        } else {
          return event.status === filter;
        }
      });
      
      return matchesSearch && matchesFilters;
    });
  };

  const filteredAndSortedEvents = sortEvents(filterEvents(events));

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Wydarzenia</h1>
            <p className="text-muted-foreground">
              Przeglądaj wydarzenia organizowane przez organizacje
            </p>
          </div>
        </div>
        
        <EventsFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewType={viewType}
          setViewType={setViewPreference}
          sortOption={sortOption}
          setSortOption={setSortOption}
          availableFilters={availableFilters}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
          </div>
        ) : filteredAndSortedEvents.length > 0 ? (
          viewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedEvents.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => handleEventClick(event.id)}
                  className="cursor-pointer"
                >
                  <EventCard event={event} showOrgName={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredAndSortedEvents.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => handleEventClick(event.id)}
                  className="cursor-pointer"
                >
                  <EventListItem event={event} showOrgName={true} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Nie znaleziono żadnych wydarzeń</h3>
            <p className="text-muted-foreground">
              Spróbuj zmienić kryteria wyszukiwania lub wróć później
            </p>
          </div>
        )}
      </div>
      
      <CookieConsent />
    </Layout>
  );
};

export default EventsList;
