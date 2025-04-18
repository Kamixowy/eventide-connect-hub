
import { supabase } from '@/lib/supabase';

export const fetchCollaborations = async (userType: 'organization' | 'sponsor') => {
  try {
    let query = supabase
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
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data?.map(collab => ({
      ...collab,
      events: collab.collaboration_events?.map(ce => ce.events) || [],
      options: collab.collaboration_options || [],
      organization: collab.organizations,
      profiles: collab.profiles ? [collab.profiles] : []
    })) || [];
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    throw error;
  }
};
