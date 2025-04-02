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
    const storedDemoUser = localStorage.getItem('demoUser');
    if (storedDemoUser) {
      try {
        setUser(JSON.parse(storedDemoUser) as User);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Error parsing demo user:', e);
        localStorage.removeItem('demoUser');
      }
    }

    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
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
        data: metadata,
        emailRedirectTo: window.location.origin + '/logowanie',
      }
    });
    
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
      await supabase.auth.signOut();
    }
    
    toast({
      title: "Wylogowano pomyślnie",
    });
  };

  const demoLogin = async (type: 'organization' | 'sponsor') => {
    const demoUser = {
      id: type === 'organization' ? 'demo-org-1' : 'demo-sponsor-1',
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
    
    if (isSupabaseConfigured()) {
      try {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', demoUser.id)
          .maybeSingle();
          
        if (!existingProfile) {
          // Insert profile using the correct types from Database
          await supabase.from('profiles').insert({
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.user_metadata.name,
            user_type: demoUser.user_metadata.userType
          });
          
          if (type === 'organization') {
            // Insert organization using the correct types
            await supabase.from('organizations').insert({
              user_id: demoUser.id,
              name: demoUser.user_metadata.name
            });
          }
        }
      } catch (error) {
        console.error('Error creating demo profile in Supabase:', error);
      }
    }
    
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
