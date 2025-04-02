
// Import the supabase client from our integration
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

// Console log for debugging purposes
console.log('Supabase Configured:', isSupabaseConfigured() ? 'Yes ✓' : 'No ✗');

// Create function to check if storage bucket exists
export const ensureStorageBuckets = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, skipping bucket check');
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
      console.log('Events bucket not found. Please make sure you have created the bucket in Supabase dashboard.');
    } else {
      console.log('Events bucket found and ready for use');
    }
  } catch (error) {
    console.error('Error checking storage buckets:', error);
  }
};

// Check for the events bucket on app initialization
if (isSupabaseConfigured()) {
  // Use setTimeout to move this to the next event loop tick
  setTimeout(() => {
    ensureStorageBuckets();
  }, 0);
}

export { supabase, isSupabaseConfigured };
