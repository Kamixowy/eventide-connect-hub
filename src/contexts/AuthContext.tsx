
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  demoLogin: (type: 'organization' | 'sponsor') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a demo user in localStorage
    const storedDemoUser = localStorage.getItem('demoUser');
    if (storedDemoUser) {
      try {
        setUser(JSON.parse(storedDemoUser) as User);
        setLoading(false);
        return; // Skip Supabase auth check if we have a demo user
      } catch (e) {
        console.error('Error parsing demo user:', e);
        localStorage.removeItem('demoUser'); // Remove invalid demo user
      }
    }

    // Only check Supabase auth if it's properly configured
    if (isSupabaseConfigured()) {
      // Check current session after loading
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // If Supabase is not configured, just set loading to false
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Uwaga: Wersja demo",
        description: "Supabase nie jest skonfigurowane. Użyj opcji logowania demo.",
        variant: "destructive",
      });
      return { error: new Error('Supabase not configured') };
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      toast({
        title: "Zalogowano pomyślnie",
        description: "Przekierowujemy Cię do panelu...",
      });
    }
    return { error };
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Uwaga: Wersja demo",
        description: "Supabase nie jest skonfigurowane. Użyj opcji logowania demo.",
        variant: "destructive",
      });
      return { error: new Error('Supabase not configured'), data: null };
    }
    
    // Use emailRedirect: false to prevent sending confirmation emails
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirect: false,
      }
    });
    
    if (!error) {
      // Auto sign in after registration since we're not doing email confirmation
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!signInError) {
        toast({
          title: "Rejestracja udana",
          description: "Zostałeś automatycznie zalogowany do systemu.",
        });
      } else {
        toast({
          title: "Rejestracja udana",
          description: "Możesz teraz zalogować się na swoje konto.",
        });
      }
    }
    
    return { data, error };
  };

  const signOut = async () => {
    // Check if we have a demo user
    if (localStorage.getItem('demoUser')) {
      localStorage.removeItem('demoUser');
      setUser(null);
      toast({
        title: "Wylogowano pomyślnie z trybu demo",
      });
      return;
    }
    
    // Otherwise use Supabase
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    
    toast({
      title: "Wylogowano pomyślnie",
    });
  };

  // Enhanced demo login that also creates a profile in Supabase for demo users
  const demoLogin = async (type: 'organization' | 'sponsor') => {
    // Create a demo user object
    const demoUser = {
      id: type === 'organization' ? 'demo-org-1' : 'demo-sponsor-1',
      email: type === 'organization' ? 'demo-org@n-go.pl' : 'demo-sponsor@n-go.pl',
      app_metadata: {}, // Required field
      aud: 'authenticated', // Required field
      created_at: new Date().toISOString(), // Required field
      user_metadata: {
        name: type === 'organization' ? 'Demo Organizacja' : 'Demo Sponsor',
        userType: type
      }
    } as User; // Cast to User type
    
    // Store in localStorage for persistence
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    
    // If Supabase is configured, we can also try to create a profile for the demo user
    // This is optional and won't affect the app functionality if it fails
    if (isSupabaseConfigured()) {
      try {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', demoUser.id)
          .maybeSingle();
          
        if (!existingProfile) {
          // Create a profile for the demo user if it doesn't exist
          await supabase.from('profiles').insert({
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.user_metadata.name,
            user_type: demoUser.user_metadata.userType
          });
          
          // If it's an organization, create an organization record as well
          if (type === 'organization') {
            await supabase.from('organizations').insert({
              user_id: demoUser.id,
              name: demoUser.user_metadata.name
            });
          }
        }
      } catch (error) {
        console.error('Error creating demo profile in Supabase:', error);
        // Continue with local demo login even if Supabase profile creation fails
      }
    }
    
    // Show toast with demo login info
    toast({
      title: `Zalogowano jako demo ${type === 'organization' ? 'organizacji' : 'sponsora'}`,
      description: "Przekierowujemy Cię do panelu...",
    });
    
    // Set the user
    setUser(demoUser);
    
    return Promise.resolve();
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    demoLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
