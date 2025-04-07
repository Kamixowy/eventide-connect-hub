import { supabase } from '@/lib/supabase';
import { CollaborationDetailsResponse } from './types';

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
            name: collaboration.sponsor.name || 'Unknown sponsor',
            username: collaboration.sponsor.username || 'Unknown',
            avatar_url: collaboration.sponsor.avatar_url || '/placeholder.svg'
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

/**
 * Gets collaboration details by ID
 * 
 * @param id - Collaboration ID
 * @returns Promise with collaboration details
 */
export const getCollaborationById = async (id: string): Promise<CollaborationDetailsResponse> => {
  try {
    console.log('Fetching collaboration with ID:', id);
    
    const { data, error } = await supabase
      .from('collaborations')
      .select(`
        id,
        status,
        message,
        total_amount,
        created_at,
        updated_at,
        sponsor_id,
        organization_id,
        events:event_id(*),
        organization:organization_id(
          id,
          name,
          description,
          logo_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching collaboration:', error);
      throw error;
    }
    
    console.log('Collaboration base data received:', data);
    
    // Fetch sponsor profile information separately
    const { data: sponsorData, error: sponsorError } = await supabase
      .from('profiles')
      .select('name, username, avatar_url')
      .eq('id', data.sponsor_id)
      .single();
      
    if (sponsorError) {
      console.error('Error fetching sponsor profile:', sponsorError);
      // Continue without sponsor data
    }
    
    console.log('Sponsor profile data:', sponsorData);
    
    // Get collaboration options
    const { data: optionsData, error: optionsError } = await supabase
      .from('collaboration_options')
      .select(`
        id,
        sponsorship_options:sponsorship_option_id(*)
      `)
      .eq('collaboration_id', id);
      
    if (optionsError) {
      console.error('Error fetching collaboration options:', optionsError);
      // Continue without options data
    }
    
    // Transform the data to match the expected interface
    const transformedData = {
      ...data,
      events: {
        ...data.events,
        date: data.events.start_date // Add the date property expected by components
      },
      // Add sponsor field structure expected by components
      sponsor: {
        id: data.sponsor_id,
        name: sponsorData?.name || sponsorData?.username || 'Unknown',
        avatar: sponsorData?.avatar_url || '/placeholder.svg'
      },
      // Add options data
      options: optionsData || [],
      // Add profiles for compatibility
      profiles: sponsorData ? [{
        name: sponsorData.name,
        username: sponsorData.username,
        avatar_url: sponsorData.avatar_url
      }] : []
    };

    console.log('Transformed collaboration data:', transformedData);
    
    // Use type assertion after ensuring object structure matches
    return transformedData as unknown as CollaborationDetailsResponse;
  } catch (error) {
    console.error('Failed to fetch collaboration:', error);
    throw error;
  }
};
