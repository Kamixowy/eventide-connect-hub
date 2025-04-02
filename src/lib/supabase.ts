
// Import the supabase client from our integration
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

// Console log for debugging purposes (you can remove this in production)
console.log('Supabase Configured:', isSupabaseConfigured() ? 'Yes ✓' : 'No ✗');

export { supabase, isSupabaseConfigured };
