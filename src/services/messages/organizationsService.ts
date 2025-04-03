
import { supabase } from '@/integrations/supabase/client';

// Function to fetch all organizations (for the new message dialog)
export const fetchOrganizations = async (): Promise<any[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, fetch all organizations
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

    // Then, fetch the profile data for each organization user
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        avatar_url,
        email,
        user_type
      `)
      .in('id', organizations.map(org => org.user_id));

    if (profilesError) {
      console.error('Error fetching organization profiles:', profilesError);
      throw profilesError;
    }

    // Combine the data
    const orgData = organizations.map(org => {
      const profile = profiles.find(p => p.id === org.user_id);
      return {
        id: profile?.id, // Use the user_id as the main ID for messaging
        name: profile?.name,
        avatar_url: profile?.avatar_url,
        email: profile?.email,
        user_type: profile?.user_type,
        organization: {
          id: org.id,
          name: org.name,
          logo_url: org.logo_url,
          category: org.category,
          description: org.description
        }
      };
    });

    console.log("Fetched organizations:", orgData);
    
    // Filter out the current user if they are an organization
    return orgData.filter(org => org.id !== user.id) || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
};
