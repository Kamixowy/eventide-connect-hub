
import { supabase } from '@/lib/supabase';

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
      
      // Query collaborations for this organization
      query = supabase
        .from('collaborations')
        .select(`
          id,
          status,
          message,
          total_amount,
          created_at,
          updated_at,
          events:event_id(
            id,
            title,
            start_date,
            image_url
          ),
          sponsor_id
        `)
        .eq('organization_id', orgData.id);
        
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
          events:event_id(
            id,
            title,
            start_date,
            image_url
          ),
          organization_id
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
    } else if (userType === 'sponsor' && data && data.length > 0) {
      // For sponsor view, we need to fetch organization data separately
      const organizationIds = data.map(collab => collab.organization_id);
      
      // Fetch all relevant organizations in one query
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, logo_url')
        .in('id', organizationIds);
        
      if (orgsError) {
        console.error('Error fetching organization data:', orgsError);
        // Continue with partial data instead of failing completely
      }
      
      // Map organization data to each collaboration
      transformedData = data.map(collaboration => {
        // Find matching organization with proper type checking
        const org = orgs?.find(o => o.id === collaboration.organization_id);
        
        // Make sure org is defined and has all required properties before using it
        const safeOrg = org ? {
          id: org.id,
          name: org.name || 'Unknown organization',
          logo_url: org.logo_url || '/placeholder.svg'
        } : {
          id: collaboration.organization_id,
          name: 'Unknown organization',
          logo_url: '/placeholder.svg'
        };
        
        return {
          ...collaboration,
          // Add organization structure for compatibility
          organization: safeOrg
        };
      });
    }

    return transformedData;
  } catch (error) {
    console.error('Failed to fetch collaborations:', error);
    throw error;
  }
};
