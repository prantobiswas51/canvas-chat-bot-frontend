import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { ChevronRight, Loader2, Pencil, Plus, Trash2, UserCog, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge, { BadgeProps } from '@/components/ui/Badge';
import Table, { Column } from '@/components/ui/Table';
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
import { User, UserRole } from '@/types/auth';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'member', label: 'Member (no dashboard access)' },
];

const ROLE_BADGE_VARIANT: Record<UserRole, BadgeProps['variant']> = {
  superadmin: 'brand',
  admin: 'success',
  manager: 'info',
  moderator: 'indigo',
  // Default role for public self-signups — flagged distinctly so an admin
  // can spot accounts still waiting to be assigned a real role.
  member: 'neutral',
};

interface UserFormState {
  id: string | null;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const emptyForm: UserFormState = { id: null, name: '', email: '', password: '', role: 'moderator' };

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(form.id);

  const loadUsers = () => {
    setIsLoading(true);
    userService
      .getAll()
      .then(setUsers)
      .catch(() => setError('Could not load users.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (u: User) => {
    setForm({ id: u.id, name: u.name, email: u.email, password: '', role: u.role });
    setError(null);
    setIsFormOpen(true);
  };

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    const axiosErr = err as AxiosError<{ message?: string | string[] }>;
    const message = axiosErr.response?.data?.message;
    return Array.isArray(message) ? message.join(', ') : message || fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    if (!isEditing && form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (isEditing && form.id) {
        const updated = await userService.update(form.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        });
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        const created = await userService.signup({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });
        setUsers((prev) => [created, ...prev]);
      }
      setForm(emptyForm);
      setIsFormOpen(false);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save this user.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (u.id === currentUser?.id) return; // safety: can't delete yourself from here
    if (!window.confirm(`Remove ${u.name} (${u.email})? This can't be undone.`)) return;

    setDeletingId(u.id);
    setError(null);
    try {
      await userService.remove(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete this user.'));
    } finally {
      setDeletingId(null);
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'Name',
      cell: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {u.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</span>
          {u.id === currentUser?.id && (
            <Badge variant="neutral" size="sm">
              You
            </Badge>
          )}
        </div>
      ),
    },
    { header: 'Email', cell: (u) => <span className="font-mono text-xs text-slate-500">{u.email}</span> },
    {
      header: 'Role',
      cell: (u) => (
        <Badge variant={ROLE_BADGE_VARIANT[u.role]} size="sm">
          {ROLE_OPTIONS.find((r) => r.value === u.role)?.label ?? u.role}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (u) => (
        <div className="flex items-center gap-1.5">
          <Button type="button" variant="ghost" size="sm" onClick={() => openEditForm(u)} title="Edit user">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={u.id === currentUser?.id || deletingId === u.id}
            onClick={() => handleDelete(u)}
            title={u.id === currentUser?.id ? "You can't delete your own account" : 'Delete user'}
            className="text-rose-500 hover:text-rose-400 disabled:text-slate-400"
          >
            {deletingId === u.id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 font-sans antialiased max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#14132B] p-6 rounded-2xl border border-slate-200 dark:border-[#27264D] shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#F81B57] font-semibold">User Management</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            Team & User Accounts
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl">
            Create, edit, and remove dashboard accounts — superadmin, admin, manager, and moderator roles.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono shrink-0">{users.length} total users</div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
            <UserCog className="w-5 h-5 text-[#F81B57]" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">All Users</h3>
          </div>
          <Button
            type="button"
            variant={isFormOpen ? 'outline' : 'primary'}
            size="sm"
            leftIcon={isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            onClick={() => (isFormOpen ? setIsFormOpen(false) : openCreateForm())}
          >
            {isFormOpen ? 'Cancel' : 'Add User'}
          </Button>
        </div>

        {error && (
          <div className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-slate-50 dark:bg-[#0E0D21] border border-slate-200 dark:border-[#27264D] rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isEditing && (
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              )}

              <div className="w-full">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                  className="w-full appearance-none bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm px-3.5 py-2 transition duration-150 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isEditing && (
              <p className="text-[11px] text-slate-400">Password changes aren't supported from this form yet.</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading users...
          </div>
        ) : (
          <Table columns={columns} data={users} keyExtractor={(u) => u.id} emptyText="No users yet." />
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
