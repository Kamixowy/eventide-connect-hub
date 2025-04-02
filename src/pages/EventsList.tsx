
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const EventsList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Przykładowe dane dla użytkowników demo lub gdy nie możemy pobrać danych z bazy
  const demoEvents = [
    {
      id: 'evt-1',
      title: 'Maraton Charytatywny',
      description: 'Coroczny maraton charytatywny wspierający lokalne schroniska dla zwierząt.',
      start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Warszawa, Park Miejski',
      expected_participants: 500,
      category: 'Sportowe',
      image_url: null
    },
    {
      id: 'evt-2',
      title: 'Festiwal Kultury',
      description: 'Międzynarodowy festiwal promujący różnorodność kulturową i dziedzictwo.',
      start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Kraków, Rynek Główny',
      expected_participants: 1000,
      category: 'Kulturalne',
      image_url: null
    },
    {
      id: 'evt-3',
      title: 'Koncert Charytatywny',
      description: 'Koncert wspierający dzieci z domów dziecka. Wystąpią lokalni artyści.',
      start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Wrocław, Hala Stulecia',
      expected_participants: 750,
      category: 'Charytatywne',
      image_url: null
    },
    {
      id: 'evt-4',
      title: 'Konferencja Ekologiczna',
      description: 'Spotkanie ekspertów i działaczy na rzecz ochrony środowiska naturalnego.',
      start_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Gdańsk, Centrum Konferencyjne',
      expected_participants: 300,
      category: 'Edukacyjne',
      image_url: null
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      // Dla użytkowników demo zwracamy statyczne dane
      if (user && user.id.startsWith('demo-')) {
        setEvents(demoEvents);
        setLoading(false);
        return;
      }
      
      // Pobieramy wydarzenia z Supabase
      try {
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
          setEvents(demoEvents);
        } else {
          console.log('Events fetched:', eventsData);
          
          // Przekształć dane z Supabase, aby dopasować je do struktury potrzebnej w komponencie
          const formattedEvents = eventsData.map(event => ({
            ...event,
            organization: event.organizations?.name || 'Nieznana organizacja'
          }));
          
          setEvents(formattedEvents.length > 0 ? formattedEvents : demoEvents);
        }
      } catch (error) {
        console.error('Error in fetching events:', error);
        toast({
          title: "Błąd",
          description: "Wystąpił problem z pobieraniem danych. Pokazujemy przykładowe dane.",
          variant: "destructive"
        });
        setEvents(demoEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [user, toast]);

  // Handle event click to navigate to event details
  const handleEventClick = (eventId: string) => {
    navigate(`/wydarzenia/${eventId}`);
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

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
          
          <div className="mt-4 md:mt-0 flex w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Szukaj wydarzeń..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter size={18} />
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                onClick={() => handleEventClick(event.id)}
                className="cursor-pointer"
              >
                <Card className="h-full transition-all hover:shadow-md">
                  {event.image_url ? (
                    <div className="relative h-48 w-full overflow-hidden">
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
                      {event.category && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-ngo text-white">{event.category}</Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center relative">
                      <Calendar size={48} className="text-gray-300" />
                      {event.category && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-ngo text-white">{event.category}</Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-2 text-ngo" /> 
                        <span>{formatDate(event.start_date)}</span>
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
                          <span>Uczestników: {event.expected_participants}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Nie znaleziono żadnych wydarzeń</h3>
            <p className="text-muted-foreground">
              Spróbuj zmienić kryteria wyszukiwania lub wróć później
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsList;
