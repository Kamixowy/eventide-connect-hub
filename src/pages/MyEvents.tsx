
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const MyEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  // Przykładowe dane dla użytkowników demo
  const demoEvents = [
    {
      id: 'evt-1',
      title: 'Maraton Charytatywny',
      description: 'Coroczny maraton charytatywny wspierający lokalne schroniska dla zwierząt.',
      start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Warszawa, Park Miejski',
      expected_participants: 500,
      image_url: null
    },
    {
      id: 'evt-2',
      title: 'Festiwal Kultury',
      description: 'Międzynarodowy festiwal promujący różnorodność kulturową i dziedzictwo.',
      start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Kraków, Rynek Główny',
      expected_participants: 1000,
      image_url: null
    },
    {
      id: 'evt-3',
      title: 'Koncert Charytatywny',
      description: 'Koncert wspierający dzieci z domów dziecka. Wystąpią lokalni artyści.',
      start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Wrocław, Hala Stulecia',
      expected_participants: 750,
      image_url: null
    },
    {
      id: 'evt-4',
      title: 'Konferencja Ekologiczna',
      description: 'Spotkanie ekspertów i działaczy na rzecz ochrony środowiska naturalnego.',
      start_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Gdańsk, Centrum Konferencyjne',
      expected_participants: 300,
      image_url: null
    }
  ];

  useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);
      
      // Dla użytkowników demo zwracamy statyczne dane
      if (user && user.id.startsWith('demo-')) {
        setEvents(demoEvents);
        setLoading(false);
        return;
      }
      
      // Dla prawdziwych użytkowników pobieramy dane z Supabase
      try {
        if (supabase && user) {
          // First get the organization ID for this user
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (orgError) {
            console.error('Error fetching organization:', orgError);
            toast({
              title: "Błąd",
              description: "Nie udało się pobrać danych organizacji.",
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
          
          // Then fetch events for this organization
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .eq('organization_id', orgData.id)
            .order('start_date', { ascending: true });
            
          if (eventsError) {
            console.error('Error fetching events:', eventsError);
            toast({
              title: "Błąd",
              description: "Nie udało się pobrać wydarzeń.",
              variant: "destructive"
            });
          } else {
            setEvents(eventsData || []);
          }
        }
      } catch (error) {
        console.error('Error in fetching events:', error);
        toast({
          title: "Błąd",
          description: "Wystąpił problem z pobieraniem danych.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyEvents();
  }, [user, toast]);

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <h1 className="text-3xl font-bold mb-2">Moje wydarzenia</h1>
            <p className="text-muted-foreground">
              Zarządzaj wydarzeniami swojej organizacji
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Szukaj w moich wydarzeniach..."
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
        
        <div className="mb-6">
          <Link to="/dodaj-wydarzenie">
            <Button className="bg-ngo hover:bg-ngo/90">
              <Plus size={16} className="mr-2" /> Dodaj nowe wydarzenie
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ładowanie wydarzeń...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link to={`/wydarzenia/${event.id}`} key={event.id}>
                <Card className="h-full transition-all hover:shadow-md">
                  {event.image_url ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                      <Calendar size={48} className="text-gray-300" />
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Nie masz jeszcze żadnych wydarzeń</h3>
            <p className="text-muted-foreground mb-6">
              Zacznij tworzyć swoje wydarzenia i zapraszać sponsorów
            </p>
            <Link to="/dodaj-wydarzenie">
              <Button className="bg-ngo hover:bg-ngo/90">
                <Plus size={16} className="mr-2" /> Dodaj pierwsze wydarzenie
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyEvents;
