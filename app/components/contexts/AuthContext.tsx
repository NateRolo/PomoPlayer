"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isPremium: boolean;
  setPremiumStatus: (status: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        console.log("Session data:", data.session ? "Session exists" : "No session");
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Check premium status if user is logged in
        if (data.session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_premium')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching premium status:", profileError);
          } else {
            console.log("Premium status from DB:", profileData?.is_premium);
            setIsPremium(profileData?.is_premium || false);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setPremiumStatus = async (status: boolean) => {
    try {
      if (!user) return;
      
      // Update in database
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: status })
        .eq('id', user.id);
        
      if (error) {
        console.error("Error updating premium status:", error);
        return;
      }
      
      // Update local state
      setIsPremium(status);
      console.log(`Premium status set to: ${status}`);
    } catch (error) {
      console.error("Error setting premium status:", error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    isPremium,
    setPremiumStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
