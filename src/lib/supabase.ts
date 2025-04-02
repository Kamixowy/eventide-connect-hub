
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
      // Create the events bucket
      const { error } = await supabase.storage.createBucket('events', {
        public: true, // Make files publicly accessible
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      });
      
      if (error) {
        // Check if the error is because the bucket already exists
        if (error.message.includes('already exists')) {
          console.log('Events bucket already exists');
          return;
        }
        console.error('Error creating events bucket:', error);
      } else {
        console.log('Events storage bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
  }
};

// Call this function on app initialization
if (isSupabaseConfigured()) {
  ensureStorageBuckets();
}

export { supabase, isSupabaseConfigured };
