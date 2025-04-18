
import { supabase } from '@/lib/supabase';

export const fetchCollaborations = async (userType: 'organization' | 'sponsor') => {
  try {
    // First get the current user session - we need to await this
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user.id;
    
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    // Build the base query
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
          id,
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters based on user type
    if (userType === 'sponsor') {
      // If user is a sponsor, filter collaborations by sponsor_id
      query = query.eq('sponsor_id', currentUserId);
    } else if (userType === 'organization') {
      // If user is an organization, filter collaborations by organization_id
      query = query.eq('organization_id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data?.map(collab => ({
      ...collab,
      events: collab.collaboration_events?.map(ce => ce.events) || [],
      options: collab.collaboration_options || [],
      organization: collab.organizations,
      sponsor: collab.profiles
    })) || [];
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    throw error;
  }
};
