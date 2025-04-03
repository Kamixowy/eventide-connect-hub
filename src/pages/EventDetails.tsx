
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  LinkIcon, 
  Facebook, 
  Linkedin, 
  Clock, 
  Tag,
  MessageSquare,
  Edit,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateEventStatus } from '@/services/eventService';
import EventPostForm from '@/components/events/posts/EventPostForm';
import EventPostsList from '@/components/events/posts/EventPostsList';

// Define status options array
const statusOptions = [
  "Planowane",
  "W przygotowaniu",
  "W trakcie",
  "Zakończone",
  "Anulowane"
];

const demoEventData = {
  id: 1,
  title: 'Bieg Charytatywny "Pomagamy Dzieciom"',
  organization: {
    id: 101,
    name: 'Fundacja Szczęśliwe Dzieciństwo',
    avatar: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  date: '15.06.2023',
  location: 'Park Centralny, Warszawa, mazowieckie',
  attendees: 350,
  category: 'Charytatywne',
  status: 'Planowane',
  description: 'Bieg charytatywny, z którego całkowity dochód zostanie przeznaczony na pomoc dzieciom w domach dziecka. Wydarzenie skierowane jest zarówno do profesjonalnych biegaczy jak i amatorów. Do wyboru będą trasy o długości 5 km, 10 km oraz półmaraton.\n\nNasza fundacja od ponad 10 lat wspiera dzieci z domów dziecka i rodzin zastępczych. Dzięki zebranym środkom będziemy mogli sfinansować zajęcia dodatkowe, wycieczki edukacyjne oraz materiały szkolne dla podopiecznych.',
  banner: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  audience: ['Rodziny z dziećmi', 'Biegacze amatorzy', 'Sportowcy', 'Firmy', 'Wolontariusze'],
  tags: ['bieg', 'charytatywny', 'pomoc dzieciom', 'sport', 'event sportowy', 'fundacja'],
  socialMedia: {
    facebook: 'https://facebook.com/event',
    linkedin: 'https://linkedin.com/event'
  },
  sponsorshipOptions: [
    {
      id: 1,
      title: 'Partner Główny',
      description: 'Logo na materiałach promocyjnych, bannery na miejscu wydarzenia, miejsce na stoisko, logo na koszulkach uczestników, wyróżnienie podczas ceremonii.',
      price: { from: 5000, to: 10000 }
    },
    {
      id: 2,
      title: 'Partner Wspierający',
      description: 'Logo na materiałach promocyjnych, banner na miejscu wydarzenia, wyróżnienie podczas ceremonii.',
      price: { from: 2000, to: 4000 }
    },
    {
      id: 3,
      title: 'Partner Medialny',
      description: 'Relacje z wydarzenia, promocja w mediach partnera.',
      price: null
    },
    {
      id: 4,
      title: 'Sponsor Nagród',
      description: 'Przekazanie nagród dla uczestników, wyróżnienie podczas ceremonii wręczenia nagród.',
      price: { from: 1000, to: 3000 }
    }
  ],
  updates: [
    {
      id: 1,
      date: '30.04.2023',
      title: 'Ruszamy z rejestracją!',
      content: 'Z radością informujemy, że uruchomiliśmy rejestrację na nasz bieg charytatywny. Liczba miejsc jest ograniczona, więc zachęcamy do szybkiego zapisywania się!',
      image: null
    },
    {
      id: 2,
      date: '15.05.2023',
      title: 'Ogłaszamy pierwszych partnerów',
      content: 'Z przyjemnością ogłaszamy pierwszych partnerów naszego wydarzenia. Dziękujemy za wsparcie i zaangażowanie w pomoc dzieciom!',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ]
};

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  
  const fetchEventDetails = async () => {
    setLoading(true);
    
    if ((user && user.id.startsWith('demo-')) || (id && id.startsWith('evt-'))) {
      setEvent(demoEventData);
      setLoading(false);
      return;
    }
    
    if (!id) {
      toast({
        title: "Błąd",
        description: "Nie znaleziono identyfikatora wydarzenia.",
        variant: "destructive"
      });
      navigate('/wydarzenia');
      return;
    }
    
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          organizations(id, name, logo_url, user_id)
        `)
        .eq('id', id)
        .maybeSingle();
        
      if (eventError) {
        console.error('Error fetching event details:', eventError);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać szczegółów wydarzenia.",
          variant: "destructive"
        });
        navigate('/wydarzenia');
        return;
      }
      
      if (!eventData) {
        toast({
          title: "Nie znaleziono",
          description: "Wydarzenie o podanym ID nie istnieje.",
          variant: "destructive"
        });
        navigate('/wydarzenia');
        return;
      }
      
      console.log('Event data:', eventData);
      
      if (user && eventData.organizations?.user_id === user.id) {
        setIsOwner(true);
      }
      
      const { data: sponsorshipData, error: sponsorshipError } = await supabase
        .from('sponsorship_options')
        .select('*')
        .eq('event_id', id);
        
      if (sponsorshipError) {
        console.error('Error fetching sponsorship options:', sponsorshipError);
      }
      
      const { data: postsData, error: postsError } = await (supabase
        .from('event_posts' as any)
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false }) as any);
        
      if (postsError) {
        console.error('Error fetching event posts:', postsError);
      }
      
      const formattedEvent = {
        id: eventData.id,
        title: eventData.title,
        organization: {
          id: eventData.organizations?.id || 'unknown',
          name: eventData.organizations?.name || 'Nieznana organizacja',
          avatar: eventData.organizations?.logo_url || null,
          userId: eventData.organizations?.user_id
        },
        date: new Date(eventData.start_date).toLocaleDateString('pl-PL'),
        location: eventData.location || 'Lokalizacja nieznana',
        detailed_location: eventData.detailed_location,
        attendees: eventData.expected_participants || 0,
        category: eventData.category || 'Inne',
        status: eventData.status || 'Planowane',
        description: eventData.description,
        banner: eventData.image_url,
        audience: eventData.audience || [],
        tags: eventData.tags || [],
        socialMedia: eventData.social_media || {},
        sponsorshipOptions: sponsorshipData ? sponsorshipData.map((option: any) => ({
          id: option.id,
          title: option.title,
          description: option.description,
          price: option.price ? { from: option.price, to: option.price * 1.5 } : null
        })) : demoEventData.sponsorshipOptions,
        posts: postsData || [],
        updates: []
      };
      
      setEvent(formattedEvent);
    } catch (error) {
      console.error('Error in fetching event details:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił problem z pobieraniem danych wydarzenia.",
        variant: "destructive"
      });
      setEvent(demoEventData);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEventDetails();
  }, [id, user, toast, navigate]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !isOwner) return;
    
    setStatusUpdating(true);
    try {
      await updateEventStatus(id, newStatus);
      
      setEvent(prev => ({
        ...prev,
        status: newStatus
      }));
      
      toast({
        title: "Status zaktualizowany",
        description: `Status wydarzenia został zmieniony na "${newStatus}".`,
      });
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować statusu wydarzenia.",
        variant: "destructive"
      });
    } finally {
      setStatusUpdating(false);
    }
  };
  
  const handlePostSuccess = () => {
    setShowPostForm(false);
    fetchEventDetails();
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <p>Ładowanie szczegółów wydarzenia...</p>
        </div>
      </Layout>
    );
  }
  
  if (!event) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Nie znaleziono wydarzenia</h2>
          <Button onClick={() => navigate('/wydarzenia')}>
            Wróć do listy wydarzeń
          </Button>
        </div>
      </Layout>
    );
  }
  
  const userType = user?.user_metadata?.userType || null;
  const isLoggedIn = !!user;
  const isOwnerVar = userType === 'organization' && user?.id === event.organization?.userId;

  const handleContactOrganization = () => {
    toast({
      title: "Wiadomość wysłana",
      description: "Twoja wiadomość została wysłana do organizacji. Otrzymasz odpowiedź wkrótce.",
    });
  };

  return (
    <Layout>
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
        <img 
          src={event.banner || '/placeholder.svg'} 
          alt={event.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = '/placeholder.svg'; 
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-6 md:left-12">
          <div className={`
            inline-block rounded-full px-3 py-1 text-xs font-medium mb-2 bg-white
            ${event.status === 'Planowane' ? 'text-blue-700' : 
              event.status === 'W przygotowaniu' ? 'text-yellow-700' : 
              event.status === 'W trakcie' ? 'text-green-700' : 
              event.status === 'Zakończone' ? 'text-gray-700' :
              event.status === 'Anulowane' ? 'text-red-700' :
              'text-gray-700'}
          `}>
            {event.status}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white shadow-sm">
            {event.title}
          </h1>
        </div>
        
        {isOwner && (
          <div className="absolute top-6 right-6 flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white shadow-md"
                  disabled={statusUpdating}
                >
                  {statusUpdating ? "Aktualizowanie..." : "Zmień status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusOptions.map((status) => (
                  <DropdownMenuItem 
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={event.status === status ? "font-bold bg-gray-100" : ""}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isOwner && (
              <Button 
                variant="success" 
                className="shadow-md"
                onClick={() => navigate(`/edytuj-wydarzenie/${id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edytuj wydarzenie
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Link to={`/organizacje/${event.organization.id}`} className="flex items-center mb-6 hover:text-ngo transition-colors">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={event.organization.avatar} alt={event.organization.name} />
                <AvatarFallback>{event.organization.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Organizator</p>
                <h3 className="font-semibold">{event.organization.name}</h3>
              </div>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center border rounded-lg p-4">
                <Calendar size={24} className="mr-3 text-ngo" /> 
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center border rounded-lg p-4">
                <MapPin size={24} className="mr-3 text-ngo" /> 
                <div>
                  <p className="text-sm text-muted-foreground">Lokalizacja</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center border rounded-lg p-4">
                <Users size={24} className="mr-3 text-ngo" /> 
                <div>
                  <p className="text-sm text-muted-foreground">Uczestnicy</p>
                  <p className="font-medium">{event.attendees} osób</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="w-full bg-transparent border-b rounded-none h-auto p-0 mb-6">
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Szczegóły
                </TabsTrigger>
                <TabsTrigger 
                  value="posts" 
                  className="rounded-none border-b-2 data-[state=active]:border-ngo data-[state=active]:text-foreground px-4 py-2"
                >
                  Posty
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <div className="prose max-w-none mb-8">
                  <h2 className="text-2xl font-bold mb-4">Opis wydarzenia</h2>
                  {event.description && event.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                  ))}
                </div>

                {event.audience && event.audience.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Odbiorcy</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.audience.map((audience: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.category && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Kategoria</h3>
                    <Badge className="bg-ngo text-white px-3 py-1 text-sm">
                      {event.category}
                    </Badge>
                  </div>
                )}

                {event.tags && event.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Tagi</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100">
                          <Tag size={14} className="mr-1" /> {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.socialMedia && (event.socialMedia.facebook || event.socialMedia.linkedin) && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Media społecznościowe</h3>
                    <div className="flex space-x-4">
                      {event.socialMedia.facebook && (
                        <a 
                          href={event.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-ngo hover:underline"
                        >
                          <Facebook size={20} className="mr-2" /> Facebook
                        </a>
                      )}
                      {event.socialMedia.linkedin && (
                        <a 
                          href={event.socialMedia.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-ngo hover:underline"
                        >
                          <Linkedin size={20} className="mr-2" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="posts" className="mt-0">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Posty</h2>
                  
                  {isOwner && !showPostForm && (
                    <Button onClick={() => setShowPostForm(true)}>
                      <Plus size={16} className="mr-2" /> Dodaj post
                    </Button>
                  )}
                </div>
                
                {isOwner && showPostForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Dodaj nowy post</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EventPostForm 
                        eventId={id || ''} 
                        onSuccess={handlePostSuccess} 
                      />
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowPostForm(false)}
                        >
                          Anuluj
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <EventPostsList 
                  posts={event.posts || []} 
                  isOwner={isOwner}
                  onPostDeleted={fetchEventDetails}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Możliwości współpracy</CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn && (
                  <div className="text-center p-4 bg-gray-50 rounded-md mb-4">
                    <p className="mb-3 font-medium">Zainteresowany sponsorowaniem tego typu wydarzenia?</p>
                    <Link to="/logowanie">
                      <Button className="btn-gradient w-full">
                        Zaloguj się, aby móc się skontaktować
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  {event.sponsorshipOptions && event.sponsorshipOptions.map((option: any) => (
                    <div key={option.id} className="border rounded-md p-4">
                      <h4 className="font-semibold mb-2">{option.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      
                      {isLoggedIn && option.price && (
                        <p className="text-sm font-medium">
                          Budżet: {option.price.from} - {option.price.to} PLN
                        </p>
                      )}
                      
                      {!isLoggedIn && option.price && (
                        <p className="text-sm italic text-muted-foreground">
                          Szczegóły cenowe dostępne po zalogowaniu
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {isLoggedIn && userType === 'sponsor' && (
                  <Button 
                    className="w-full mt-4 btn-gradient"
                    onClick={handleContactOrganization}
                  >
                    <MessageSquare size={16} className="mr-2" /> Skontaktuj się z organizacją
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Udostępnij wydarzenie</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Skopiowano link",
                      description: "Link do wydarzenia został skopiowany do schowka.",
                    });
                  }}
                >
                  <LinkIcon size={16} className="mr-2" /> Kopiuj link
                </Button>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                    <Facebook size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                    <Linkedin size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
