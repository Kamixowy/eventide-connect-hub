
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

// Ensure events table has status column
export const ensureEventsSchema = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, skipping schema check');
      return;
    }

    // We'll check if we can update a record with a status field
    // This is a non-invasive way to check if the column exists
    const { error } = await supabase.rpc('check_column_exists', { 
      table_name: 'events',
      column_name: 'status'
    });

    if (error) {
      console.log('Status column might not exist in events table. Please check your schema.');
    } else {
      console.log('Events table schema appears to be complete');
    }
  } catch (error) {
    console.error('Error checking events schema:', error);
  }
};

// Check for the events bucket and schema on app initialization
if (isSupabaseConfigured()) {
  // Use setTimeout to move this to the next event loop tick
  setTimeout(() => {
    ensureStorageBuckets();
    ensureEventsSchema();
  }, 0);
}

export { supabase, isSupabaseConfigured };
