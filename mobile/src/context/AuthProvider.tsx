import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/session', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSession(data.data.session);
        } catch (_) {
          setSession(null);
        }
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
