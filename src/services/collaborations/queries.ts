
import { supabase } from '@/lib/supabase';
import { CollaborationDetailsResponse } from './types';

/**
 * Fetches all collaborations for authenticated user
 * 
 * @param userType - Type of user (organization or sponsor)
 * @returns Promise with array of collaborations
 */
export const fetchCollaborations = async (userType?: string) => {
  try {
    console.log('Fetching collaborations for user type:', userType);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Determine query based on user type
    let query;

    if (userType === 'organization') {
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
          sponsor:sponsor_id(*)
        `)
        .eq('organization_id', user.id);
    } else {
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
        profiles:sponsor_id!inner(name, avatar_url),
        organization:organization_id(
          id,
          name,
          description,
          logo_url
        ),
        options:collaboration_options(
          id,
          sponsorship_options:sponsorship_option_id(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching collaboration:', error);
      throw error;
    }

    console.log('Collaboration data received:', data);

    // Get the profiles data correctly - it's an array of objects
    const profileData = Array.isArray(data.profiles) ? data.profiles[0] : null;

    // Transform the data to match the expected interface
    // The database returns start_date but our component expects date
    const transformedData = {
      ...data,
      events: {
        ...data.events,
        date: data.events.start_date // Add the date property expected by components
      },
      // Add sponsor field structure expected by components
      sponsor: {
        id: data.sponsor_id,
        name: profileData?.name || 'Unknown',
        avatar: profileData?.avatar_url || '/placeholder.svg'
      }
    };

    // Use type assertion after ensuring object structure matches
    return transformedData as unknown as CollaborationDetailsResponse;
  } catch (error) {
    console.error('Failed to fetch collaboration:', error);
    throw error;
  }
};
