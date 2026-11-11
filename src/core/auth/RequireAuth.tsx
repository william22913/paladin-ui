import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { BootScreen } from '../../components/app/BootScreen';

/** REQ-004: every store page is behind the session guard. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <BootScreen />;

  if (status === 'anonymous') {
    const next = `${location.pathname}${location.search}`;
    const target = next === '/' ? '/login' : `/login?next=${encodeURIComponent(next)}`;
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}
