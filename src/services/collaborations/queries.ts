
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

    let query;
    let userData;

    // First get the organization ID if user is an organization
    if (userType === 'organization') {
      // Get organization ID for the current user
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, logo_url')
        .eq('user_id', user.id)
        .single();
      
      if (orgError) {
        console.error('Error fetching organization data:', orgError);
        throw orgError;
      }
      
      console.log('Found organization for user:', orgData);
      userData = orgData;
      
      // Query collaborations for this organization's events
      // Important change: We join through events instead of directly searching by organization_id
      // This avoids the foreign key relationship error
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
          organization_id,
          sponsor_id
        `)
        .eq('organization_id', orgData.id);
        
      // After getting the base collaboration data, we'll fetch sponsor profiles separately
    } else {
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
      userData = profileData;
      
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
    
    // For organization view, we need to fetch sponsor data separately
    let transformedData = data || [];
    
    if (userType === 'organization' && data && data.length > 0) {
      // Collect all sponsor IDs to fetch
      const sponsorIds = data.map(collab => collab.sponsor_id);
      
      // Fetch all relevant sponsor profiles in one query
      const { data: sponsorProfiles, error: sponsorError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', sponsorIds);
        
      if (sponsorError) {
        console.error('Error fetching sponsor profiles:', sponsorError);
        // Continue with partial data instead of failing completely
      }
      
      // Map sponsor data to each collaboration
      transformedData = data.map(collaboration => {
        // Find matching sponsor profile
        const sponsorProfile = sponsorProfiles?.find(
          profile => profile.id === collaboration.sponsor_id
        ) || { name: 'Unknown sponsor', avatar_url: '/placeholder.svg' };
        
        return {
          ...collaboration,
          // Add profiles structure as expected by components
          profiles: [
            {
              name: sponsorProfile.name || 'Unknown sponsor',
              avatar_url: sponsorProfile.avatar_url || '/placeholder.svg'
            }
          ]
        };
      });
    }

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
      .select('name, avatar_url')
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
      profiles: sponsorData ? [sponsorData] : []
    };

    console.log('Transformed collaboration data:', transformedData);
    
    // Use type assertion after ensuring object structure matches
    return transformedData as unknown as CollaborationDetailsResponse;
  } catch (error) {
    console.error('Failed to fetch collaboration:', error);
    throw error;
  }
};
