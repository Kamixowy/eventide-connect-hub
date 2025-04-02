
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
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
    // Sprawdź aktualną sesję po załadowaniu
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Nasłuchuj zmian w autentykacji
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
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
    await supabase.auth.signOut();
    toast({
      title: "Wylogowano pomyślnie",
    });
  };

  // Funkcja do logowania demo
  const demoLogin = async (type: 'organization' | 'sponsor') => {
    // W wersji demo ustawiamy tylko lokalny stan
    const demoUser = {
      id: type === 'organization' ? 'demo-org-1' : 'demo-sponsor-1',
      email: type === 'organization' ? 'demo-org@n-go.pl' : 'demo-sponsor@n-go.pl',
      user_metadata: {
        name: type === 'organization' ? 'Demo Organizacja' : 'Demo Sponsor',
        userType: type
      }
    };
    
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    
    // Wywołujemy toast z informacją o demo logowaniu
    toast({
      title: `Zalogowano jako demo ${type === 'organization' ? 'organizacji' : 'sponsora'}`,
      description: "Przekierowujemy Cię do panelu...",
    });
    
    // Symulujemy ustawienie użytkownika (w rzeczywistości używalibyśmy Supabase)
    setUser(demoUser as User);
    
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
