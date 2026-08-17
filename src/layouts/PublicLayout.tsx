import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import CanvasLogo from '@/components/common/CanvasLogo';
import { useAuth } from '@/context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Already signed in — no reason to show login/signup again. RequireAuth
  // handles the 'member'-blocked screen on the other side of this redirect.
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0F0F23] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects matching logo crimson theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1E56]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand logo header */}
      <div className="flex items-center gap-3 mb-6 z-10">
        <CanvasLogo size={44} />
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-500 z-10 font-mono space-y-1.5">
        <p>&copy; {new Date().getFullYear()} Canvas Art Supplies Ltd. Powered by AI Customer Service & NestJS.</p>
        <p>
          <Link to="/privacy-policy" className="text-slate-500 hover:text-[#FF1E56] hover:underline">
            Privacy &amp; Policy
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default PublicLayout;
