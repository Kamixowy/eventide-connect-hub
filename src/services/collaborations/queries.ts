
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
          sponsor_id,
          profiles:sponsor_id(name, avatar_url)
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
          ),
          profiles:organization_id(name, avatar_url)
        `)
        .eq('sponsor_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching collaborations:', error);
      throw error;
    }

    console.log('Collaborations data received:', data);
    return data || [];
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
        profiles:sponsor_id(name, avatar_url),
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
        profiles: data.profiles || {}
      }
    };

    // Use type assertion after ensuring object structure matches
    return transformedData as unknown as CollaborationDetailsResponse;
  } catch (error) {
    console.error('Failed to fetch collaboration:', error);
    throw error;
  }
};
