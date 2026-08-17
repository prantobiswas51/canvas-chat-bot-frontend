import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  MessageCircle,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  Bell,
  Search,
  ExternalLink,
  Sun,
  Moon,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CanvasLogo from '@/components/common/CanvasLogo';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  // Dev phase: every role sees every nav item — no RBAC filtering for now.
  const allNavItems = [
    {
      name: 'Analytics Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Unified Inbox',
      path: '/chat',
      icon: MessageSquare,
      badge: '3 Live',
    },
    {
      name: 'Social Comments',
      path: '/comments',
      icon: MessageCircle,
      badge: 'FB & IG',
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: ShoppingBag,
      badge: 'Bot Auto',
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: Package,
    },
    {
      name: 'Users',
      path: '/users',
      icon: Users,
    },
    {
      name: 'AI Training & Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#0F0E24] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans antialiased relative overflow-hidden transition-colors duration-200">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-[#161530] border-b border-slate-200 dark:border-[#292850] px-4 py-3 sticky top-0 z-30 shrink-0">
        <CanvasLogo size={34} showText />
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-[#F81B57]/10 text-[#F81B57] text-[10px] font-bold rounded-lg border border-[#F81B57]/30">
            {role.toUpperCase()}
          </span>

          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-[#201F42]"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-[#201F42] focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#14132B] border-r border-slate-200 dark:border-[#27264D] flex flex-col justify-between transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen shrink-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5">
          {/* Brand Header with Official Canvas Logo Icon */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <CanvasLogo size={40} showText />
          </div>

          {/* Current Role Indicator (read-only) */}
          <div className="mb-5 p-3 rounded-xl bg-slate-100 dark:bg-[#1D1C3D] border border-slate-200 dark:border-[#2D2C57]">
            <div className="flex items-center gap-2">
              {role === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-[#F81B57]" />
              ) : (
                <UserCheck className="w-4 h-4 text-indigo-400" />
              )}
              <div>
                <p className="font-semibold">Hello, {user?.name || 'User'}</p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {role}
                </p>
                <p className="text-[10px] text-slate-400">
                  {role === 'admin' ? 'Full Access Granted' : 'Moderator Scope'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Bot Active Badge */}
          <div className="mb-6 p-2.5 rounded-xl bg-slate-50 dark:bg-[#111029] border border-slate-200 dark:border-[#232247] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#F81B57]" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Canvas AI Agent</span>
            </div>
            <Badge variant="success" size="sm" dot>
              Online
            </Badge>
          </div>

          {/* Dynamic RBAC Navigation Items */}
          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center justify-between">
              <span>Navigation Menu</span>
              <span className="text-[9px] font-mono text-slate-500">{allNavItems.length} links</span>
            </p>

            {allNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#F81B57]/10 dark:bg-[#F81B57]/15 text-[#F81B57] border border-[#F81B57]/30 dark:border-[#F81B57]/40 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E1D40] hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5 text-slate-400 dark:text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="neutral" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#27264D] bg-slate-50 dark:bg-[#100F24]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F81B57]/15 border border-[#F81B57]/30 flex items-center justify-center text-[#F81B57] font-bold text-xs">
                {user?.name.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Admin Lead'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#F81B57] hover:bg-slate-200 dark:hover:bg-[#201F42] rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top SaaS Header */}
        <header className="hidden md:flex items-center justify-between h-16 px-6 bg-white/90 dark:bg-[#161530]/80 border-b border-slate-200 dark:border-[#27264D] sticky top-0 z-20 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations, SKUs, or customers..."
                className="w-full bg-slate-100 dark:bg-[#0B0A1C] border border-slate-200 dark:border-[#27264D] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-[#201F42] flex items-center gap-1.5 text-xs font-medium cursor-pointer border border-slate-200 dark:border-[#27264D] transition-colors"
              title="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-[#27264D] mx-0.5" />

            <Badge variant="brand" size="sm" className="gap-1.5 px-3 py-1">
              <span className="w-1.5 h-1.5 bg-[#F81B57] rounded-full animate-ping" />
              NestJS Backend Active
            </Badge>

            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-[#201F42] relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F81B57] rounded-full" />
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-[#27264D] mx-1" />

            <Button
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => window.open('https://canvasart.com', '_blank')}
            >
              Live E-Store
            </Button>
          </div>
        </header>

        {/* Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-[#0F0E24] text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
