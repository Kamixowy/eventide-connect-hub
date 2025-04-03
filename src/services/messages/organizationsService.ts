
import { supabase } from '@/integrations/supabase/client';

// Function to fetch all organizations and sponsors (for the new message dialog)
export const fetchOrganizations = async (): Promise<any[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Fetch profiles for both organizations and sponsors
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        avatar_url,
        email,
        user_type
      `);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Fetch organizations to link with organization profiles
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select(`
        id,
        name,
        logo_url,
        category,
        description,
        user_id
      `);

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError);
      throw orgsError;
    }

    // Combine the data
    const usersData = profiles.map(profile => {
      // For organization users, find and attach their organization data
      if (profile.user_type === 'organization') {
        const org = organizations.find(o => o.user_id === profile.id);
        return {
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url,
          user_type: profile.user_type,
          organization: org ? {
            id: org.id,
            name: org.name,
            logo_url: org.logo_url,
            category: org.category,
            description: org.description
          } : null
        };
      }
      
      // For sponsor users or other user types
      return {
        id: profile.id,
        name: profile.name,
        avatar_url: profile.avatar_url,
        user_type: profile.user_type
      };
    });

    console.log("Fetched users data:", usersData);
    
    // Filter out the current user
    return usersData.filter(user_data => user_data.id !== user.id) || [];
  } catch (error) {
    console.error('Error fetching organizations and sponsors:', error);
    return [];
  }
};
