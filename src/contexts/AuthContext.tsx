import { createContext, useContext, useEffect, useState } from 'react';
import { User, createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Initialize Supabase client
const supabase = createClient(
  'https://zpbqzuazbmgyifhwphga.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnF6dWF6Ym1neWlmaHdwaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjI0MTgsImV4cCI6MjA0OTY5ODQxOH0.HVvzkkFpq4m_AecBfYHyyVYHoZgJRIi8uxMxvBOBLmA'
);

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message === 'Invalid login credentials') {
          toast({ 
            description: "Invalid email or password. Please check your credentials or sign up if you don't have an account.", 
            variant: "destructive" 
          });
        } else {
          toast({ description: error.message, variant: "destructive" });
        }
        throw error;
      }
      toast({ description: "Successfully signed in!" });
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Starting signup process for:', email);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirm_sent: true,
          }
        }
      });
      
      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast({ description: error.message, variant: "destructive" });
        throw error;
      }

      if (data?.user?.identities?.length === 0) {
        toast({ 
          description: "An account with this email already exists. Please try signing in instead.", 
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        description: "Please check your email (including spam folder) for the confirmation link to complete your registration!", 
        duration: 6000
      });
    } catch (error: any) {
      console.error('Detailed signup error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({ description: error.message, variant: "destructive" });
        throw error;
      }
      toast({ description: "Successfully signed out!" });
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};