import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from 'react';
  import { supabase } from '../lib/supabase';
  import { Session } from '@supabase/supabase-js';
  
  interface AuthContextType {
    session: Session | null;
    loading: boolean;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // 1) Load any persisted session on app start
      supabase.auth.getSession().then(({ data: { session: storedSession } }) => {
        setSession(storedSession);
        setLoading(false);
      });
  
      // 2) Listen for login / logout events
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      });
  
      // 3) Clean up on unmount
      return () => subscription.unsubscribe();
    }, []);
  
    const value: AuthContextType = { session, loading };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used inside an <AuthProvider>');
    }
    return context;
  };
  