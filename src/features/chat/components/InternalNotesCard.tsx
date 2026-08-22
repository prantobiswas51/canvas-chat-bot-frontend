import React, { useEffect, useState } from 'react';
import { FileText, Save, Loader2, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CustomerProfile } from '@/types/chat';
import customerService from '@/services/customerService';

export interface InternalNotesCardProps {
  customer: CustomerProfile;
}

// Private, team-only note about this customer — persisted per customer
// (customers.notes), never sent to the customer or into the AI system
// prompt. Replaces the old panel's fake/read-only "CRM notes" text.
export const InternalNotesCard: React.FC<InternalNotesCardProps> = ({ customer }) => {
  const [value, setValue] = useState(customer.notes ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the draft whenever the selected customer changes — otherwise an
  // unsaved edit typed for customer A would bleed into customer B's textarea.
  useEffect(() => {
    setValue(customer.notes ?? '');
    setSaved(false);
    setError(null);
  }, [customer.id, customer.notes]);

  const isDirty = value !== (customer.notes ?? '');

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await customerService.updateNotes(customer.id, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Could not save the note — please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-500" />
          Internal Notes
        </h4>
        {saved && (
          <span className="text-[10px] text-emerald-500 flex items-center gap-1">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Private note about this customer — not visible to them..."
        className="w-full bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-2 text-[11px] text-slate-800 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:border-amber-500/60 resize-y leading-snug"
      />

      {error && <p className="text-[10px] text-rose-500">{error}</p>}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!isDirty || isSaving}
          onClick={handleSave}
          leftIcon={isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
        >
          {isSaving ? 'Saving...' : 'Save Note'}
        </Button>
      </div>
    </Card>
  );
};

export default InternalNotesCard;
