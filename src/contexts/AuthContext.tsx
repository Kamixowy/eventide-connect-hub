import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

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
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (!error) {
      toast({
        title: "Rejestracja udana",
        description: "Na Twój adres e-mail został wysłany link potwierdzający.",
      });
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

  // Function for demo login
  const demoLogin = async (type: 'organization' | 'sponsor') => {
    // In demo version we just set local state
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
    
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    
    // Show toast with demo login info
    toast({
      title: `Zalogowano jako demo ${type === 'organization' ? 'organizacji' : 'sponsora'}`,
      description: "Przekierowujemy Cię do panelu...",
    });
    
    // Set the user (in reality we would use Supabase)
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
