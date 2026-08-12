import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
import { UserRole } from '@/types/auth';
import { User as UserIcon, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'moderator', label: 'Moderator' },
];

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('moderator');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await userService.signup({ name, email, password, role });
      showToast('Account created — please sign in.');
      navigate('/login');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string | string[] }>;
      const message = axiosErr.response?.data?.message;
      setError(Array.isArray(message) ? message.join(', ') : message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 space-y-6 bg-slate-900/90 border-slate-800 shadow-2xl">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-400">Set up dashboard access for your team</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<UserIcon className="w-4 h-4" />}
          placeholder="Tanvir Ahmed"
          required
        />

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
          placeholder="At least 8 characters"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="w-full">
          <label htmlFor="role" className="block text-xs font-medium text-slate-300 mb-1.5">
            Role
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full appearance-none bg-slate-900/90 border border-slate-800 text-slate-100 rounded-lg text-sm px-3.5 py-2 pl-10 transition duration-150 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
          Create Account
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FF1E56] hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </Card>
  );
};

export default SignupPage;
