
import { supabase } from '@/lib/supabase';

export const fetchCollaborations = async (userType: 'organization' | 'sponsor') => {
  try {
    // First get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user.id;
    
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    console.log('Current user ID:', currentUserId);
    console.log('Fetching collaborations as:', userType);

    if (userType === 'sponsor') {
      // If user is a sponsor, build query for sponsor
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
          organizations (
            id,
            name,
            logo_url,
            description
          ),
          profiles (
            id,
            name,
            avatar_url
          )
        `)
        .eq('sponsor_id', currentUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collaborations for sponsor:', error);
        throw error;
      }

      return data?.map(collab => ({
        ...collab,
        events: collab.collaboration_events?.map(ce => ce.events) || [],
        options: collab.collaboration_options || [],
        organization: collab.organizations,
        sponsor: collab.profiles
      })) || [];
    } else {
      // First get the organization ID for the current user
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, logo_url, description') // Include all fields we need
        .eq('user_id', currentUserId)
        .single();
        
      if (orgError || !orgData) {
        console.error('Error finding organization:', orgError);
        throw new Error('Could not find organization for current user');
      }
      
      console.log('Found organization ID:', orgData.id);
      
      // For organization, build query to get collaborations where org is the recipient
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
          profiles:sponsor_id (
            id,
            name,
            avatar_url
          )
        `)
        .eq('organization_id', orgData.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching collaborations for organization:', error);
        throw error;
      }
      
      return data?.map(collab => ({
        ...collab,
        events: collab.collaboration_events?.map(ce => ce.events) || [],
        options: collab.collaboration_options || [],
        organization: { 
          id: orgData.id,
          name: orgData.name,
          logo_url: orgData.logo_url,
          description: orgData.description
        },
        sponsor: collab.profiles
      })) || [];
    }
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    throw error;
  }
};
