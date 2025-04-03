
import { supabase } from '@/integrations/supabase/client';

// Function to fetch all organizations (for the new message dialog)
export const fetchOrganizations = async (): Promise<any[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: organizations, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        avatar_url,
        email,
        user_type,
        organization:organizations(
          id,
          name,
          logo_url,
          category,
          description
        )
      `)
      .eq('user_type', 'organization');

    if (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }

    console.log("Fetched organizations:", organizations);
    
    // Filter out the current user if they are an organization
    return organizations.filter(org => org.id !== user.id) || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
};
