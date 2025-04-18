
import { supabase } from '@/lib/supabase';

export const getCollaborationById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .select(`
        *,
        collaboration_events (
          events:event_id (
            id,
            title,
            start_date,
            image_url
          )
        ),
        collaboration_options (
          id,
          title,
          description,
          amount,
          is_custom,
          sponsorship_option_id
        ),
        organizations!inner (
          id,
          name,
          logo_url,
          description
        ),
        profiles:sponsor_id (
          name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      events: data.collaboration_events?.map(ce => ce.events) || [],
      options: data.collaboration_options || [],
      organization: data.organizations,
      profiles: data.profiles ? [data.profiles] : []
    };
  } catch (error) {
    console.error('Error fetching collaboration:', error);
    throw error;
  }
};
