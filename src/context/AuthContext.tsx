import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User as ApiUser, UserRole as ApiUserRole } from '@/types/auth';

export type UserRole = ApiUserRole;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (apiUser: ApiUser) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'canvas_user';

// Only the display-oriented subset of the real logged-in user is cached
// here — no tokens (those live separately in canvas_access_token /
// canvas_refresh_token, read directly by apiClient's interceptor).
function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // No fallback demo user — until login() actually runs (real backend
  // credentials verified), the user is null and nothing dashboard-side
  // should render. See RequireAuth for the route-level enforcement.
  const [user, setUser] = useState<User | null>(() => loadStoredUser());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const login = (apiUser: ApiUser) => {
    const nextUser: User = {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role,
      avatar: apiUser.avatarUrl,
    };
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
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
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        login,
        toastMessage,
        showToast,
        logout,
      }}
    >
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
