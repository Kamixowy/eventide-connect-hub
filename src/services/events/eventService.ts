
import { supabase } from '@/lib/supabase';
import { EventFormValues, SponsorshipOption } from '@/components/events/edit/EventEditSchema';

export const fetchEventById = async (id: string) => {
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*, organizations(id, user_id)')
    .eq('id', id)
    .single();
    
  if (eventError) {
    throw eventError;
  }
  
  const { data: sponsorshipData, error: sponsorshipError } = await supabase
    .from('sponsorship_options')
    .select('*')
    .eq('event_id', id);
    
  if (sponsorshipError) {
    console.error('Error fetching sponsorship options:', sponsorshipError);
  }
  
  const { data: postsData, error: postsError } = await supabase
    .from('event_posts')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false });
    
  if (postsError) {
    console.error('Error fetching event posts:', postsError);
  }
  
  const fullEventData = {
    ...eventData,
    sponsorshipOptions: sponsorshipData || [],
    posts: postsData || []
  };
  
  return fullEventData;
};

export const fetchRecentEvents = async (limit: number = 4) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizations(name)')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching recent events:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchRecentEvents:', error);
    throw error;
  }
};
