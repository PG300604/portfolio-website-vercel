import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { authed } = useAuth();

  if (!authed) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
