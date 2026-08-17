import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CanvasLogo from '@/components/common/CanvasLogo';
import { useAuth } from '@/context/AuthContext';

// Shown instead of the dashboard for accounts stuck at the default
// 'member' role (every public /signup account starts here) until an
// existing admin upgrades them from the Users page.
export const PendingAccessPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0F0E24] p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-5">
        <div className="flex justify-center">
          <CanvasLogo size={44} showText />
        </div>

        <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-amber-500" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Access Pending</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You're signed in as <span className="font-medium text-slate-700 dark:text-slate-300">{user?.email}</span>,
            but your account doesn't have dashboard access yet. An admin needs to assign you a role before you can
            get in.
          </p>
        </div>

        <Button variant="outline" size="md" className="w-full" leftIcon={<LogOut className="w-4 h-4" />} onClick={logout}>
          Sign Out
        </Button>
      </Card>
    </div>
  );
};

export default PendingAccessPage;
