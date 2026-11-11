import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { setUnauthorizedHandler } from '../api/client';
import { getMe, login as loginRequest, logout as logoutRequest } from '../api/services/auth';
import type { User } from '../api/types';

type Status = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  status: Status;
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Only same-origin absolute paths are valid post-login destinations. */
export function safeNext(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/';
  return next;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const probe = useCallback(async () => {
    try {
      const current = await getMe();
      setUser(current);
      setStatus('authenticated');
    } catch {
      setUser(null);
      setStatus('anonymous');
    }
  }, []);

  useEffect(() => {
    void probe();
  }, [probe]);

  // REQ-043: any authenticated 401 ends the local session and routes to login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus('anonymous');
      const here = `${window.location.pathname}${window.location.search}`;
      if (here.startsWith('/login')) return;
      navigate(`/login?next=${encodeURIComponent(here)}&reason=expired`, { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  // REQ-005: a page restored from the back-forward cache re-probes the session.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void probe();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [probe]);

  const login = useCallback(async (username: string, password: string) => {
    const current = await loginRequest(username, password);
    setUser(current);
    setStatus('authenticated');
    return current;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setStatus('anonymous');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const value = useMemo(
    () => ({ status, user, login, logout }),
    [status, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
