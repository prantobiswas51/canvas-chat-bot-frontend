import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/authService';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, tokens } = await authService.login(email, password);

      localStorage.setItem('canvas_access_token', tokens.accessToken);
      localStorage.setItem('canvas_refresh_token', tokens.refreshToken);
      login(user);

      navigate('/chat');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;

      if (!axiosErr.response) {
        // Request never got a response — server down, unreachable, or a network/CORS failure.
        setError("Can't reach the server. Please check your connection and try again.");
      } else {
        const message = axiosErr.response.data?.message;
        setError(Array.isArray(message) ? message.join(', ') : message || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 space-y-6 bg-slate-900/90 border-slate-800 shadow-2xl">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Sign In to Dashboard</h2>
        <p className="text-xs text-slate-400">Enter your credentials to manage omnichannel chats</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="you@canvasart.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="Enter your password"
          required
        />

        {error && (
          <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        Need an account?{' '}
        <Link to="/signup" className="text-[#FF1E56] hover:underline font-medium">
          Sign up
        </Link>
      </div>
    </Card>
  );
};

export default LoginPage;
