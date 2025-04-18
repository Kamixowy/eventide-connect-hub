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
      
      // Check for real Supabase authenticated users
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
        description: "Supabase nie jest skonfigurowane. Proszę skonfigurować Supabase.",
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
        description: "Supabase nie jest skonfigurowane. Proszę skonfigurować Supabase.",
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
    try {
      console.log('Signing out...');
      
      if (isSupabaseConfigured()) {
        console.log('Signing out Supabase user');
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
        
        // Clear user state
        setUser(null);
        setSession(null);
        
        toast({
          title: "Wylogowano pomyślnie",
        });
        
        // Redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast({
        title: "Błąd wylogowania",
        description: "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut
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
