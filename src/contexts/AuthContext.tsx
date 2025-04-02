
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
    const checkAuth = async () => {
      setLoading(true);
      
      // First check for demo user
      const storedDemoUser = localStorage.getItem('demoUser');
      if (storedDemoUser) {
        try {
          setUser(JSON.parse(storedDemoUser) as User);
          setSession(null); // Demo users don't have a session
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing demo user:', e);
          localStorage.removeItem('demoUser');
        }
      }

      // Then check for real Supabase authenticated users
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          console.log('Auth session data:', data);
          
          setSession(data.session);
          setUser(data.session?.user ?? null);
        } catch (error) {
          console.error('Error fetching auth session:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up the auth state change listener
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
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
    
    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Błąd logowania",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      console.log('Sign in successful:', data);
      toast({
        title: "Zalogowano pomyślnie",
        description: "Przekierowujemy Cię do panelu...",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: "Błąd logowania",
        description: "Wystąpił nieoczekiwany błąd podczas logowania",
        variant: "destructive",
      });
      return { error };
    }
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
    
    try {
      console.log('Attempting to sign up with email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + '/logowanie',
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Błąd rejestracji",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }
      
      console.log('Sign up successful:', data);
      
      // Try to sign in immediately after signup
      if (!error) {
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
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: "Błąd rejestracji",
        description: "Wystąpił nieoczekiwany błąd podczas rejestracji",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (localStorage.getItem('demoUser')) {
      localStorage.removeItem('demoUser');
      setUser(null);
      toast({
        title: "Wylogowano pomyślnie z trybu demo",
      });
      return;
    }
    
    if (isSupabaseConfigured()) {
      try {
        console.log('Attempting to sign out');
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('Sign out error:', error);
          toast({
            title: "Błąd wylogowania",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error('Unexpected sign out error:', error);
      }
    }
    
    toast({
      title: "Wylogowano pomyślnie",
    });
  };

  const demoLogin = async (type: 'organization' | 'sponsor') => {
    const demoUser = {
      id: type === 'organization' ? 'demo-organization' : 'demo-sponsor',
      email: type === 'organization' ? 'demo-org@n-go.pl' : 'demo-sponsor@n-go.pl',
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      user_metadata: {
        name: type === 'organization' ? 'Demo Organizacja' : 'Demo Sponsor',
        userType: type
      }
    } as User;
    
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    
    toast({
      title: `Zalogowano jako demo ${type === 'organization' ? 'organizacji' : 'sponsora'}`,
      description: "Przekierowujemy Cię do panelu...",
    });
    
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
