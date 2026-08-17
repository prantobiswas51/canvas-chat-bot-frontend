import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

export interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/chat',
}) => {
  const { user, role, showToast } = useAuth();

  const isAllowed = !!user && !!role && allowedRoles.includes(role);

  useEffect(() => {
    if (!isAllowed) {
      showToast('Access Denied: You do not have permission to view this section.');
    }
  }, [isAllowed, showToast]);

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
