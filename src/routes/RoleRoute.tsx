import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/store';

interface RoleRouteProps {
  allowedRoles: Array<'patient' | 'doctor' | 'admin'>;
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
