import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as ApiUser, UserRole as ApiUserRole } from '@/types/auth';

// Local demo role used for nav gating (DashboardLayout's Admin/Moderator switcher).
// Real backend roles (superadmin/admin/moderator/manager) map onto this on login.
export type UserRole = 'admin' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (apiUser: ApiUser) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'usr-admin-1',
  name: 'Tanvir Admin',
  email: 'admin@canvasart.com',
  role: 'admin',
};

const MODERATOR_USER: User = {
  id: 'usr-mod-1',
  name: 'Rahim Moderator',
  email: 'moderator@canvasart.com',
  role: 'moderator',
};

// Maps the real 4-tier backend role onto the demo nav's admin/moderator split.
function mapApiRole(apiRole: ApiUserRole): UserRole {
  return apiRole === 'superadmin' || apiRole === 'admin' ? 'admin' : 'moderator';
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('canvas_user_role') as UserRole;
    return savedRole === 'moderator' ? 'moderator' : 'admin';
  });

  // The real authenticated user (set by login()). Falls back to a demo user
  // when nobody has actually logged in yet (e.g. before visiting /login).
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const user = authUser ?? (role === 'admin' ? ADMIN_USER : MODERATOR_USER);

  useEffect(() => {
    localStorage.setItem('canvas_user_role', role);
  }, [role]);

  const login = (apiUser: ApiUser) => {
    const mappedRole = mapApiRole(apiUser.role);
    setAuthUser({
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: mappedRole,
      avatar: apiUser.avatarUrl,
    });
    setRole(mappedRole);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const logout = () => {
    localStorage.removeItem('canvas_access_token');
    localStorage.removeItem('canvas_refresh_token');
    localStorage.removeItem('canvas_user_role');
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, toastMessage, showToast, logout }}>
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-[#1C1B3D] dark:text-slate-100 px-4 py-3 rounded-xl border border-rose-500/50 shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 font-sans text-xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-sm font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
