import React, { useEffect, useState } from 'react';
import { Plus, Radio, X, Loader2, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge, { BadgeProps } from '@/components/ui/Badge';
import Table, { Column } from '@/components/ui/Table';
import channelService, { ChannelAccountSummary, ConnectableChannel } from '@/services/channelService';

const CHANNEL_META: Record<
  ConnectableChannel,
  { label: string; idLabel: string; idPlaceholder: string; idHelp: string; badgeVariant: BadgeProps['variant'] }
> = {
  whatsapp: {
    label: 'WhatsApp',
    idLabel: 'Phone Number ID',
    idPlaceholder: 'e.g. 123456123',
    idHelp: 'Meta App → WhatsApp → API Setup → "Phone number ID".',
    badgeVariant: 'success',
  },
  messenger: {
    label: 'Messenger',
    idLabel: 'Facebook Page ID',
    idPlaceholder: 'e.g. 719869691207472',
    idHelp: 'Page → About tab, or Page Transparency → numeric Page ID.',
    badgeVariant: 'info',
  },
  instagram: {
    label: 'Instagram',
    idLabel: 'IG Business Account ID',
    idPlaceholder: 'e.g. 17841400000000000',
    idHelp: 'Meta App → Instagram → connected professional account ID.',
    badgeVariant: 'brand',
  },
};

const CHANNEL_ORDER: ConnectableChannel[] = ['whatsapp', 'messenger', 'instagram'];

const emptyForm = { channel: 'whatsapp' as ConnectableChannel, externalAccountId: '', displayName: '', accessToken: '' };

export const ChannelsPanel: React.FC = () => {
  const [channels, setChannels] = useState<ChannelAccountSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  const loadChannels = () => {
    setIsLoading(true);
    channelService
      .list()
      .then(setChannels)
      .catch(() => setError('Could not load connected channels.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (c: ChannelAccountSummary) => {
    setEditingId(c.id);
    // accessToken never comes back from the API (write-only) — leave blank;
    // an empty submit keeps whatever token is already stored server-side.
    setForm({ channel: c.channel, externalAccountId: c.externalAccountId, displayName: c.displayName, accessToken: '' });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.externalAccountId.trim() || !form.displayName.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      // Backend upserts by (channel, externalAccountId), so create/update
      // are the same call — editing just resubmits that same pair.
      const saved = await channelService.update({
        channel: form.channel,
        externalAccountId: form.externalAccountId.trim(),
        displayName: form.displayName.trim(),
        accessToken: form.accessToken.trim() || undefined,
      });
      setChannels((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)]);
      setJustSavedId(saved.id);
      setTimeout(() => setJustSavedId(null), 3000);
      closeForm();
    } catch {
      setError('Could not save this channel — check the fields and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c: ChannelAccountSummary) => {
    if (!window.confirm(`Remove "${c.displayName}"? Incoming messages on this channel will stop being tracked.`)) return;

    setDeletingId(c.id);
    setError(null);
    try {
      await channelService.remove(c.id);
      setChannels((prev) => prev.filter((ch) => ch.id !== c.id));
      if (editingId === c.id) closeForm();
    } catch {
      setError('Could not remove this channel — please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const counts = CHANNEL_ORDER.map((ch) => ({
    channel: ch,
    count: channels.filter((c) => c.channel === ch).length,
  }));

  const columns: Column<ChannelAccountSummary>[] = [
    {
      header: 'Channel',
      cell: (c) => (
        <div className="flex items-center gap-2">
          <Badge variant={CHANNEL_META[c.channel].badgeVariant} size="sm" dot>
            {CHANNEL_META[c.channel].label}
          </Badge>
          {justSavedId === c.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
        </div>
      ),
    },
    { header: 'Display Name', accessorKey: 'displayName' },
    {
      header: CHANNEL_META.whatsapp.idLabel + ' / Page ID / IG ID',
      cell: (c) => <span className="font-mono text-xs text-slate-500">{c.externalAccountId}</span>,
    },
    {
      header: 'Connected',
      cell: (c) => (
        <span className="text-xs text-slate-500">
          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: '',
      cell: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditForm(c)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#F81B57] hover:bg-slate-100 dark:hover:bg-[#1C1B3D] cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(c)}
            disabled={deletingId === c.id}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#1C1B3D] cursor-pointer disabled:opacity-50"
            title="Remove"
          >
            {deletingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
          <Radio className="w-5 h-5 text-[#F81B57]" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Connected Channels</h3>
        </div>
        <Button
          type="button"
          variant={isFormOpen ? 'outline' : 'primary'}
          size="sm"
          leftIcon={isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          onClick={() => (isFormOpen ? closeForm() : openAddForm())}
        >
          {isFormOpen ? 'Cancel' : 'Add Channel'}
        </Button>
      </div>

      {/* Per-channel connected counts */}
      <div className="flex items-center gap-2 flex-wrap">
        {counts.map(({ channel, count }) => (
          <div
            key={channel}
            className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0E0D21] border border-slate-200 dark:border-[#27264D] rounded-lg px-3 py-1.5 text-xs"
          >
            <Badge variant={CHANNEL_META[channel].badgeVariant} size="sm" dot>
              {CHANNEL_META[channel].label}
            </Badge>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{count}</span>
          </div>
        ))}
        <div className="ml-auto text-xs text-slate-400 font-mono">{channels.length} total connected</div>
      </div>

      {error && (
        <div className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {isFormOpen && (
        // Plain div, not a <form> — this panel is rendered inside SettingsPage's
        // own outer <form>, and HTML forbids nested forms (the browser drops the
        // inner one, so a nested submit button silently submits the *outer* mock
        // form instead of actually saving the channel — see handleSubmit below).
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-[#0E0D21] border border-slate-200 dark:border-[#27264D] rounded-xl">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Channel Type</label>
            <div className="flex items-center gap-2">
              {CHANNEL_ORDER.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  disabled={!!editingId}
                  onClick={() => setForm((f) => ({ ...f, channel: ch }))}
                  title={editingId ? "Channel type can't be changed while editing — remove and re-add instead" : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    editingId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  } ${
                    form.channel === ch
                      ? 'bg-[#F81B57] border-[#F81B57] text-white'
                      : 'border-slate-300 dark:border-[#27264D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C1B3D]'
                  }`}
                >
                  {CHANNEL_META[ch].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              placeholder="e.g. Canvas Art Supplies WhatsApp"
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              required
            />
            <Input
              label={CHANNEL_META[form.channel].idLabel}
              placeholder={CHANNEL_META[form.channel].idPlaceholder}
              helperText={CHANNEL_META[form.channel].idHelp}
              value={form.externalAccountId}
              onChange={(e) => setForm((f) => ({ ...f, externalAccountId: e.target.value }))}
              disabled={!!editingId}
              required
            />
          </div>

          <Input
            type="password"
            label={`Access Token${editingId ? ' (leave blank to keep current)' : ''}`}
            placeholder={editingId ? '••••••••••••' : 'Paste the Page/WhatsApp access token'}
            helperText="Each Page/number has its own token — used directly for sending/receiving on this channel."
            value={form.accessToken}
            onChange={(e) => setForm((f) => ({ ...f, accessToken: e.target.value }))}
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={closeForm}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              onClick={handleSubmit}
              leftIcon={!isSaving ? <Plus className="w-3.5 h-3.5" /> : undefined}
            >
              {isSaving ? 'Saving...' : editingId ? 'Update Channel' : 'Save Channel'}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading channels...
        </div>
      ) : (
        <Table
          columns={columns}
          data={channels}
          keyExtractor={(c) => c.id}
          emptyText="No channels connected yet — click 'Add Channel' to connect WhatsApp, Messenger, or Instagram."
        />
      )}
    </Card>
  );
};

export default ChannelsPanel;
