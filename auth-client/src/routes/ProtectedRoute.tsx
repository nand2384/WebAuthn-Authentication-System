import { Outlet, useLocation, Navigate as RouterNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/store';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <RouterNavigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
