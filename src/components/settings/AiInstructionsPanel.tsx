import React, { useEffect, useState } from 'react';
import { MessageSquareText, Save, CheckCircle2, Loader2, Bot, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import aiSettingsService, { AiProviderName } from '@/services/aiSettingsService';

const PROVIDER_OPTIONS: { value: AiProviderName; label: string }[] = [
  { value: 'openai', label: 'GPT (OpenAI)' },
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'gemini', label: 'Gemini (Google)' },
];

// The only *real* AI-configuration surface right now — this text is
// appended to the AI bot's system prompt on every reply (see
// webhook.service.ts). Everything else on the "Knowledge Base & AI
// Training Hub" tab is a visual mockup, not wired to the live bot.
export const AiInstructionsPanel: React.FC = () => {
  const [value, setValue] = useState('');
  const [aiEnabledByDefault, setAiEnabledByDefault] = useState(true);
  const [aiProvider, setAiProvider] = useState<AiProviderName>('openai');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingDefault, setIsTogglingDefault] = useState(false);
  const [isSwitchingProvider, setIsSwitchingProvider] = useState(false);
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
        setAiProvider(settings.aiProvider);
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

  const handleSave = async () => {
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

  const handleProviderChange = async (next: AiProviderName) => {
    const previous = aiProvider;
    if (next === previous) return;

    setAiProvider(next); // optimistic
    setIsSwitchingProvider(true);
    setError(null);
    try {
      await aiSettingsService.update({ aiProvider: next });
    } catch {
      setAiProvider(previous); // revert
      setError('Could not switch AI provider — please try again.');
    } finally {
      setIsSwitchingProvider(false);
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

      {/* AI provider selector — picks which model actually generates
          replies/tool-calls/vision. Takes effect on the very next message,
          no restart needed. */}
      <div className="p-3.5 bg-slate-50 dark:bg-[#0E0D21] border border-slate-200 dark:border-[#27274D] rounded-xl space-y-2.5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#F81B57] shrink-0" />
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">AI Provider</label>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Which model replies to customers, calls tools (product search, order creation), and reads photos.
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            value={aiProvider}
            onChange={(e) => handleProviderChange(e.target.value as AiProviderName)}
            disabled={isLoading || isSwitchingProvider}
            className="w-full appearance-none bg-white dark:bg-[#181835] border border-slate-300 dark:border-[#27274D] rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#F81B57] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {PROVIDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {isSwitchingProvider && (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
        </div>
      </div>

      {/* AI-enabled-by-default toggle — controls the starting mode for
          brand-new conversations only; existing chats are unaffected. */}
      <div className="p-3.5 bg-slate-50 dark:bg-[#0E0D21] border border-slate-200 dark:border-[#27274D] rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Bot className="w-4 h-4 text-[#F81B57] shrink-0" />
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              AI auto-reply
            </label>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Off: the AI never replies to any conversation — everything needs a human. On: the AI replies to every
              chat that's set to AI mode, except ones already assigned to a specific moderator. Takes effect
              immediately on the next incoming message.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={aiEnabledByDefault}
          onClick={handleToggleDefault}
          disabled={isLoading || isTogglingDefault}
          className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
            aiEnabledByDefault ? 'bg-[#F81B57]' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${
              aiEnabledByDefault ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Store policies, tone rules, do's and don'ts — appended to every AI reply's instructions. Applies immediately,
        no restart needed.
      </p>

      {/* Plain div, not a <form> — this panel is rendered inside SettingsPage's
          own outer <form>, and HTML forbids nested forms (the browser drops
          the inner one, so a nested submit button silently submits the
          *outer* mock form instead of saving these instructions). */}
      <div className="space-y-3">
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
            type="button"
            variant="primary"
            size="sm"
            disabled={isLoading || isSaving}
            onClick={handleSave}
            leftIcon={isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          >
            {isSaving ? 'Saving...' : 'Save Instructions'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AiInstructionsPanel;
