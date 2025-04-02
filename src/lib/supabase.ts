
import { createClient } from '@supabase/supabase-js';

// Default values for development/demo purposes
const DEFAULT_SUPABASE_URL = 'https://xyzcompany.supabase.co';
const DEFAULT_SUPABASE_KEY = 'public-anon-key';

// Get values from environment variables or use defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Console log for debugging purposes (you can remove this in production)
console.log('Supabase URL:', supabaseUrl ? 'Configured ✓' : 'Missing ✗');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Configured ✓' : 'Missing ✗');

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== DEFAULT_SUPABASE_URL && supabaseAnonKey !== DEFAULT_SUPABASE_KEY;
};
