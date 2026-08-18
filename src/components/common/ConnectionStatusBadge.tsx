import React from 'react';
import { WifiOff, Loader2 } from 'lucide-react';
import { useSocketStatus } from '@/hooks/useSocketStatus';

// Replaces the old hardcoded "Backend Active" badge with the real state of
// the live-update socket — so a dropped connection (e.g. Nginx not proxying
// /socket.io/, or the backend restarting) is visible in the UI instead of
// silently requiring a manual page refresh to see new messages.
export const ConnectionStatusBadge: React.FC = () => {
  const status = useSocketStatus();

  if (status === 'connected') {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
        title="Live updates connected — new messages appear instantly."
      >
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        Live
      </div>
    );
  }

  if (status === 'connecting') {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
        title="Reconnecting to live updates..."
      >
        <Loader2 className="w-3 h-3 animate-spin" />
        Reconnecting
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 cursor-help"
      title="Live updates disconnected — new messages won't appear until this reconnects. Refresh the page if it stays like this."
    >
      <WifiOff className="w-3 h-3" />
      Offline
    </div>
  );
};

export default ConnectionStatusBadge;
