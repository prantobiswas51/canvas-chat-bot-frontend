import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import RequireAuth from '@/components/auth/RequireAuth';

import DashboardPage from '@/pages/DashboardPage';
import ChatPage from '@/pages/ChatPage';
import CommentsPage from '@/pages/CommentsPage';
import OrdersPage from '@/pages/OrdersPage';
import InventoryPage from '@/pages/InventoryPage';
import UsersPage from '@/pages/UsersPage';
import LogBookPage from '@/pages/LogBookPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/chat" replace />,
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    // Standalone — deliberately outside both PublicLayout (which redirects
    // signed-in users away) and RequireAuth, so it's reachable by anyone
    // regardless of login state. Meta's App Review needs a working Privacy
    // Policy URL it can load without an account.
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    // No valid session -> /login. A 'member' account (default for public
    // signup) gets a blocked "Access Pending" screen instead of any of the
    // routes below — see RequireAuth.
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Shared Routes (Accessible by Admin and Moderator)
          {
            path: '/chat',
            element: <ChatPage />,
          },
          {
            path: '/comments',
            element: <CommentsPage />,
          },
          {
            path: '/orders',
            element: <OrdersPage />,
          },
          {
            path: '/inventory',
            element: <InventoryPage />,
          },

          // Dev phase: no per-route role gating beyond the member block above.
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/users',
            element: <UsersPage />,
          },
          {
            path: '/logbook',
            element: <LogBookPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
