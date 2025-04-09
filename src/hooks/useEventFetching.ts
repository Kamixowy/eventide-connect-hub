
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { demoEventData } from '@/data/mockEventData';
import { formatEventData } from '@/utils/eventFormatUtils';

export const useEventFetching = (eventId: string | undefined, userId: string | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  
  const fetchEventDetails = async () => {
    setLoading(true);
    
    if ((userId && userId.startsWith('demo-')) || (eventId && eventId.startsWith('evt-'))) {
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
      
      if (userId && eventData.organizations?.user_id === userId) {
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
      
      const formattedEvent = formatEventData(
        eventData, 
        sponsorshipData, 
        postsData, 
        demoEventData.sponsorshipOptions
      );
      
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
  }, [eventId, userId]);
  
  return { event, loading, isOwner, fetchEventDetails };
};
