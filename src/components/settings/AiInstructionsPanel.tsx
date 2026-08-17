import React, { useEffect, useState } from 'react';
import { MessageSquareText, Save, CheckCircle2, Loader2, Bot } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import aiSettingsService from '@/services/aiSettingsService';

// The only *real* AI-configuration surface right now — this text is
// appended to the AI bot's system prompt on every reply (see
// webhook.service.ts). Everything else on the "Knowledge Base & AI
// Training Hub" tab is a visual mockup, not wired to the live bot.
export const AiInstructionsPanel: React.FC = () => {
  const [value, setValue] = useState('');
  const [aiEnabledByDefault, setAiEnabledByDefault] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingDefault, setIsTogglingDefault] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    aiSettingsService
      .get()
      .then((settings) => {
        if (cancelled) return;
        setValue(settings.customInstructions ?? '');
        setAiEnabledByDefault(settings.aiEnabledByDefault);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load current instructions.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await aiSettingsService.update({ customInstructions: value });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Could not save instructions — please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDefault = async () => {
    const next = !aiEnabledByDefault;
    setAiEnabledByDefault(next); // optimistic
    setIsTogglingDefault(true);
    setError(null);
    try {
      await aiSettingsService.update({ aiEnabledByDefault: next });
    } catch {
      setAiEnabledByDefault(!next); // revert
      setError('Could not save the default — please try again.');
    } finally {
      setIsTogglingDefault(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2 text-[#F81B57]">
          <MessageSquareText className="w-5 h-5" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">AI Instructions</h3>
        </div>
        {saved && (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Saved
          </Badge>
        )}
      </div>

      {/* AI-enabled-by-default toggle — controls the starting mode for
          brand-new conversations only; existing chats are unaffected. */}
      <div className="p-3.5 bg-slate-50 dark:bg-[#0E0D21] border border-slate-200 dark:border-[#27274D] rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Bot className="w-4 h-4 text-[#F81B57] shrink-0" />
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              Enable AI by default for new chats
            </label>
            <p className="text-[10px] text-slate-400 mt-0.5">
              New conversations start with the AI replying automatically. Turn off to start every new chat with a
              human moderator instead. Doesn't affect chats already in progress.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleDefault}
          disabled={isLoading || isTogglingDefault}
          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
            aiEnabledByDefault ? 'bg-[#F81B57]' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`w-3.5 h-3.5 bg-white rounded-full absolute top-1 transition-transform ${
              aiEnabledByDefault ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Store policies, tone rules, do's and don'ts — appended to every AI reply's instructions. Applies immediately,
        no restart needed.
      </p>

      <form onSubmit={handleSave} className="space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-6 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading current instructions...
          </div>
        ) : (
          <textarea
            rows={8}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              'e.g.\n- Delivery within Dhaka takes 1-2 days, outside Dhaka 3-5 days.\n' +
              '- Never offer discounts beyond what the customer asks about.\n' +
              '- If a customer sounds angry or asks for a refund, hand off to a human moderator.'
            }
            className="w-full bg-slate-100 dark:bg-[#0E0D21] border border-slate-300 dark:border-[#27274D] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#F81B57] resize-y leading-relaxed font-mono"
          />
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading || isSaving}
            leftIcon={isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          >
            {isSaving ? 'Saving...' : 'Save Instructions'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AiInstructionsPanel;
