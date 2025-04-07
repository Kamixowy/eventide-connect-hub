
import { supabase } from '@/lib/supabase';
import { CollaborationDetailsResponse } from '../types';

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
        name: sponsorData?.name || 'Unknown',
        avatar: sponsorData?.avatar_url || '/placeholder.svg'
      },
      // Add options data
      options: optionsData || [],
      // Add profiles for compatibility
      profiles: sponsorData ? [{
        name: sponsorData.name || '',
        username: sponsorData.username || '',
        avatar_url: sponsorData.avatar_url || ''
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
