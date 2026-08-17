import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PendingAccessPage from '@/pages/PendingAccessPage';

// Top-level gate for the whole dashboard route tree: no valid session →
// bounce to /login. A 'member' account (default role for public self-signup)
// is authenticated but sees a blocked screen instead of any real dashboard
// content until an admin upgrades their role via the Users page.
export const RequireAuth: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'member') {
    return <PendingAccessPage />;
  }

  return <Outlet />;
};

export default RequireAuth;
