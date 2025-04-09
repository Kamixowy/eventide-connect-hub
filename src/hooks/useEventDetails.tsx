
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { updateEventStatus } from '@/services/eventService';

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
      price: { from: 5000, to: 10000 },
      benefits: ['Logo na materiałach promocyjnych', 'Bannery na miejscu wydarzenia', 'Miejsce na stoisko', 'Logo na koszulkach uczestników', 'Wyróżnienie podczas ceremonii']
    },
    {
      id: 2,
      title: 'Partner Wspierający',
      description: 'Logo na materiałach promocyjnych, banner na miejscu wydarzenia, wyróżnienie podczas ceremonii.',
      price: { from: 2000, to: 4000 },
      benefits: ['Logo na materiałach promocyjnych', 'Banner na miejscu wydarzenia', 'Wyróżnienie podczas ceremonii']
    },
    {
      id: 3,
      title: 'Partner Medialny',
      description: 'Relacje z wydarzenia, promocja w mediach partnera.',
      price: null,
      benefits: ['Relacje z wydarzenia', 'Promocja w mediach partnera']
    },
    {
      id: 4,
      title: 'Sponsor Nagród',
      description: 'Przekazanie nagród dla uczestników, wyróżnienie podczas ceremonii wręczenia nagród.',
      price: { from: 1000, to: 3000 },
      benefits: ['Przekazanie nagród dla uczestników', 'Wyróżnienie podczas ceremonii wręczenia nagród']
    }
  ],
  updates: []
};

const statusOptions = [
  "Planowane",
  "W przygotowaniu",
  "W trakcie",
  "Zakończone",
  "Anulowane"
];

export const useEventDetails = (eventId: string | undefined) => {
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
    
    if ((user && user.id.startsWith('demo-')) || (eventId && eventId.startsWith('evt-'))) {
      setEvent(demoEventData);
      setLoading(false);
      return;
    }
    
    if (!eventId) {
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
        .eq('id', eventId)
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
        .eq('event_id', eventId);
        
      if (sponsorshipError) {
        console.error('Error fetching sponsorship options:', sponsorshipError);
      }
      
      const { data: postsData, error: postsError } = await (supabase
        .from('event_posts' as any)
        .select('*')
        .eq('event_id', eventId)
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
        date: new Date(eventData.start_date).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        start_date: eventData.start_date,
        end_date: eventData.end_date,
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
          price: { 
            from: option.price, 
            to: option.price_to || option.price 
          },
          benefits: option.benefits || []
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
  
  const handleStatusChange = async (newStatus: string) => {
    if (!eventId || !isOwner) return;
    
    setStatusUpdating(true);
    try {
      await updateEventStatus(eventId, newStatus);
      
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Skopiowano link",
      description: "Link do wydarzenia został skopiowany do schowka.",
    });
  };
  
  const handleContactOrganization = () => {
    toast({
      title: "Wiadomość wysłana",
      description: "Twoja wiadomość została wysłana do organizacji. Otrzymasz odpowiedź wkrótce.",
    });
  };
  
  useEffect(() => {
    fetchEventDetails();
  }, [eventId, user, toast, navigate]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return {
    event,
    loading,
    isOwner,
    statusUpdating,
    showPostForm,
    statusOptions,
    setShowPostForm,
    handleStatusChange,
    handlePostSuccess,
    fetchEventDetails,
    handleCopyLink,
    handleContactOrganization
  };
};
