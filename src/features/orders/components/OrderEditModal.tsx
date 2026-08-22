import React, { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { OrderRecord, OrderRecordStatus, UpdateOrderPayload } from '@/services/orderService';

export interface OrderEditModalProps {
  order: OrderRecord;
  onClose: () => void;
  onSave: (id: string, payload: UpdateOrderPayload) => Promise<void>;
}

const STATUS_OPTIONS: OrderRecordStatus[] = ['pending', 'confirmed', 'cancelled'];

// Self-contained overlay dialog — this app has no shared Modal primitive yet,
// so this is a one-off fixed-position backdrop + panel, styled to match the
// rest of the dashboard (slate/indigo palette, same Button/Input components).
export const OrderEditModal: React.FC<OrderEditModalProps> = ({ order, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState(order.customerName);
  const [phone, setPhone] = useState(order.phone);
  const [address, setAddress] = useState(order.address);
  const [productSku, setProductSku] = useState(order.productSku);
  const [quantity, setQuantity] = useState(String(order.quantity));
  const [unitPrice, setUnitPrice] = useState(order.unitPrice ?? '');
  const [status, setStatus] = useState<OrderRecordStatus>(order.status);
  const [notes, setNotes] = useState(order.notes ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    const parsedQuantity = parseInt(quantity, 10);
    if (!customerName.trim() || !phone.trim() || !address.trim() || !productSku.trim()) {
      setError('Customer name, phone, address, and SKU are required.');
      return;
    }
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    const payload: UpdateOrderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      productSku: productSku.trim(),
      quantity: parsedQuantity,
      status,
      notes: notes.trim() || undefined,
    };
    if (unitPrice.trim()) {
      const parsedPrice = parseFloat(unitPrice);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        setError('Unit price must be a valid non-negative number.');
        return;
      }
      payload.unitPrice = parsedPrice;
    }

    setIsSaving(true);
    try {
      await onSave(order.id, payload);
      onClose();
    } catch {
      setError('Could not save changes — please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#12122A] border border-slate-200 dark:border-[#27274D] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#27274D]">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Edit Order</h2>
            <p className="text-[11px] font-mono text-indigo-500 dark:text-indigo-400 mt-0.5">{order.invoiceId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 p-1 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5">
          <Input label="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Product SKU" value={productSku} onChange={(e) => setProductSku(e.target.value)} />
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Unit Price (${order.currency})`}
              type="number"
              min={0}
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="Optional"
            />
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderRecordStatus)}
                className="w-full bg-slate-900/90 border border-slate-800 text-slate-100 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes — color/size preference, etc."
              className="w-full bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
            />
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200 dark:border-[#27274D]">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            leftIcon={isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderEditModal;
