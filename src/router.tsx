import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';

import DashboardPage from '@/pages/DashboardPage';
import ChatPage from '@/pages/ChatPage';
import CommentsPage from '@/pages/CommentsPage';
import OrdersPage from '@/pages/OrdersPage';
import InventoryPage from '@/pages/InventoryPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
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

      // Dev phase: no role gating — every role can see every route.
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
