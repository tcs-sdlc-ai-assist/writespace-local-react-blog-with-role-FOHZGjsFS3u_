import { createContext, useContext, useState, useCallback } from 'react';
import { getCurrentSession, login as sessionLogin, logout as sessionLogout } from '../utils/SessionManager.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getCurrentSession());

  const login = useCallback((username, password) => {
    const result = sessionLogin(username, password);
    if (!result.error) {
      setSession(result);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    sessionLogout();
    setSession(null);
  }, []);

  const refreshSession = useCallback(() => {
    const current = getCurrentSession();
    setSession(current);
    return current;
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}