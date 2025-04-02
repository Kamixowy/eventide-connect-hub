
// Import the supabase client from our integration
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

// Console log for debugging purposes
console.log('Supabase Configured:', isSupabaseConfigured() ? 'Yes ✓' : 'No ✗');

// Create function to check if storage bucket exists and create if not
export const ensureStorageBuckets = async () => {
  try {
    // Check if events bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const eventsBucketExists = buckets?.some(bucket => bucket.name === 'events');
    
    if (!eventsBucketExists) {
      // Create the events bucket
      const { error } = await supabase.storage.createBucket('events', {
        public: true, // Make files publicly accessible
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      });
      
      if (error) {
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
