
// Import the supabase client from our integration
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

// Console log for debugging purposes
console.log('Supabase Configured:', isSupabaseConfigured() ? 'Yes ✓' : 'No ✗');

// Create function to check if storage bucket exists and create if not
export const ensureStorageBuckets = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, skipping bucket creation');
      return;
    }
    
    // Check if events bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const eventsBucketExists = buckets?.some(bucket => bucket.name === 'events');
    
    if (!eventsBucketExists) {
      console.log('Events bucket does not exist, but we will not try to create it automatically');
      console.log('Please create the "events" bucket manually in the Supabase dashboard');
      
      // We don't try to create bucket automatically because it often fails due to permissions
      // Instead, we recommend the user to create it manually in the Supabase dashboard
    } else {
      console.log('Events bucket already exists');
    }
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
  }
};

// Call this function on app initialization, but don't block the main thread
if (isSupabaseConfigured()) {
  // Use setTimeout to move this to the next event loop tick
  setTimeout(() => {
    ensureStorageBuckets();
  }, 0);
}

export { supabase, isSupabaseConfigured };
