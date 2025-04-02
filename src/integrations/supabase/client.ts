
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mytipitigarmiiryljns.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dGlwaXRpZ2FybWlpcnlsam5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1OTk5MjcsImV4cCI6MjA1OTE3NTkyN30.txoDe3cCm5sEmI-mxho6Q5YqNk-wEUiswjGKbjK2bSQ";

// Create the Supabase client with auth configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    redirectTo: window.location.origin + '/logowanie',
  }
});

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Use type casting to avoid TypeScript literal type errors
  const defaultUrl = "https://xyzcompany.supabase.co" as string;
  const defaultKey = "public-anon-key" as string;
  
  return SUPABASE_URL !== defaultUrl && 
         SUPABASE_PUBLISHABLE_KEY !== defaultKey;
};
