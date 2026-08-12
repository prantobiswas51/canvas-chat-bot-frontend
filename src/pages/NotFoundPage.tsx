import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <h1 className="text-6xl font-extrabold text-indigo-500 font-mono">404</h1>
      <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm">
        The route you are trying to access does not exist or has been moved.
      </p>
      <Button
        variant="primary"
        size="md"
        leftIcon={<Home className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFoundPage;
