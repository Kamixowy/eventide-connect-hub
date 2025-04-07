import { supabase } from '@/lib/supabase';

/**
 * Fetches all collaborations for authenticated user
 * 
 * @param userType - Type of user (organization or sponsor)
 * @param organizations - Array of organizations (only used for organization users)
 * @returns Promise with array of collaborations
 */
export const fetchCollaborations = async (userType?: string, organizations?: any[]) => {
  try {
    console.log('Fetching collaborations for user type:', userType);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query;

    // For organization users
    if (userType === 'organization' && organizations && organizations.length > 0) {
      console.log('Fetching collaborations for organization ids:', organizations.map(org => org.id));
      
      // Get organization IDs from memberships
      const organizationIds = organizations.map(org => org.id);
      
      // Query collaborations for these organizations
      query = supabase
        .from('collaborations')
        .select(`
          id,
          status,
          message,
          total_amount,
          created_at,
          updated_at,
          events:event_id(*),
          sponsor:sponsor_id(
            id, 
            name,
            username,
            avatar_url
          )
        `)
        .in('organization_id', organizationIds);
    } else {
      // For sponsor users - keep existing query
      console.log('Fetching collaborations for sponsor:', user.id);
      
      // Get profile data for sponsor
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        throw profileError;
      }
      
      console.log('Found profile for user:', profileData);
      
      // Query collaborations for this sponsor
      query = supabase
        .from('collaborations')
        .select(`
          id,
          status,
          message,
          total_amount,
          created_at,
          updated_at,
          events:event_id(*),
          organization:organization_id(
            id,
            name,
            description,
            logo_url
          )
        `)
        .eq('sponsor_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching collaborations:', error);
      throw error;
    }

    console.log('Collaborations data received:', data);
    
    // Transform data for consistent format between user types
    const transformedData = data?.map(collaboration => {
      // For organization view, we need to transform sponsor data
      if (userType === 'organization' && collaboration.sponsor) {
        return {
          ...collaboration,
          // Add profiles structure as expected by components
          profiles: [{
            name: collaboration.sponsor?.name || 'Unknown sponsor',
            username: collaboration.sponsor?.username || 'Unknown',
            avatar_url: collaboration.sponsor?.avatar_url || '/placeholder.svg'
          }]
        };
      }
      return collaboration;
    }) || [];

    return transformedData;
  } catch (error) {
    console.error('Failed to fetch collaborations:', error);
    throw error;
  }
};
