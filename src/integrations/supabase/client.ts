
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
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
});

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Use type casting to avoid TypeScript literal type errors
  const defaultUrl = "https://xyzcompany.supabase.co" as string;
  const defaultKey = "public-anon-key" as string;
  
  return SUPABASE_URL !== defaultUrl && 
         SUPABASE_PUBLISHABLE_KEY !== defaultKey;
};

// Enable realtime for direct_conversations, direct_messages, and conversation_participants tables
export const enableMessagingRealtime = async () => {
  try {
    console.log('Enabling realtime for messaging tables...');
    
    // Check if connected to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Auth session:', session ? 'Active' : 'None');

    // Check if the client is properly configured
    if (!isSupabaseConfigured()) {
      console.error('Supabase is not properly configured');
      return;
    }

    // Set up realtime subscriptions for the messaging tables
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'direct_conversations' 
      }, payload => {
        console.log('Direct conversation change detected:', payload);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'direct_messages' 
      }, payload => {
        console.log('Direct message change detected:', payload);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversation_participants' 
      }, payload => {
        console.log('Conversation participant change detected:', payload);
      })
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
      
    console.log('Realtime subscription channel created:', channel.topic);
    
    console.log('Messaging realtime capability enabled');
    return channel;
  } catch (error) {
    console.error('Error enabling realtime for messaging:', error);
    return null;
  }
};

// Initialize realtime when the client is imported
enableMessagingRealtime();
