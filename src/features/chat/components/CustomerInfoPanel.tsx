import React, { useState } from 'react';
import { CustomerProfile } from '@/types/chat';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Phone, Mail, ShoppingBag, MapPin, Crown, Palette, PackageCheck, Copy, Check, FileText, Megaphone } from 'lucide-react';
import TemporaryInventoryWidget from '@/components/TemporaryInventoryWidget';

export interface CustomerInfoPanelProps {
  customer: CustomerProfile;
  onSendMessage?: (text: string) => void;
}

export const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({ customer, onSendMessage }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const avgOrderValue = customer.totalOrders > 0
    ? Math.round(customer.totalSpent / customer.totalOrders)
    : 0;

  return (
    <div className="hidden xl:flex flex-col w-80 bg-slate-100 dark:bg-slate-900/90 border-l border-slate-200 dark:border-slate-800 p-4 space-y-3.5 overflow-y-auto h-full font-sans">
      {/* 1. Customer Core Profile Card */}
      <Card className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/30 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-tight">{customer.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-mono uppercase bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800/60 inline-block">
                  {customer.channel}
                </span>
                {customer.tier && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800/60 flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" />
                    {customer.tier}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info List */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          {customer.phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{customer.phone}</span>
              </div>
            </div>
          )}

          {customer.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}

          {customer.address && (
            <div className="flex items-start justify-between gap-1 pt-0.5">
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#F81B57] shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight leading-snug">
                  {customer.address}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyAddress(customer.address!)}
                title="Copy Address"
                className="text-slate-400 hover:text-indigo-400 p-0.5 shrink-0 cursor-pointer"
              >
                {copiedAddress ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Customer Interest Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {customer.tags.map((tag) => (
            <Badge key={tag} variant="indigo" size="sm">{tag}</Badge>
          ))}
          {customer.points && (
            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
              ⚡ {customer.points} Loyalty Pts
            </span>
          )}
        </div>
      </Card>

      {/* Lead Source / Meta Ad Attribution Card */}
      {customer.leadSource && (
        <Card className="p-3.5 space-y-2 text-xs bg-slate-900/90 text-slate-100 border border-indigo-900/60 shadow-xs">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-pink-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-[#F81B57]" />
              Lead Origin & Ad Tracking
            </span>
            {customer.leadSource.adId && (
              <span className="text-[10px] font-mono text-slate-400">{customer.leadSource.adId}</span>
            )}
          </h4>

          <div className="flex items-start gap-2.5 pt-1">
            {customer.leadSource.adThumbnailUrl && (
              <img
                src={customer.leadSource.adThumbnailUrl}
                alt="Ad Thumbnail"
                className="w-11 h-11 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0"
              />
            )}
            <div className="space-y-1 min-w-0 flex-1">
              <p className="font-semibold text-slate-100 leading-snug line-clamp-2 text-xs">
                {customer.leadSource.adTitle || customer.leadSource.campaignName}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-pink-300 bg-pink-500/20 px-1.5 py-0.2 rounded border border-pink-500/30">
                  {customer.leadSource.platformName}
                </span>
              </div>
            </div>
          </div>

          {customer.leadSource.campaignName && (
            <div className="p-1.5 bg-slate-950/80 rounded border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between gap-1">
              <span>Campaign:</span>
              <span className="text-indigo-300 font-semibold truncate max-w-[150px]">{customer.leadSource.campaignName}</span>
            </div>
          )}
        </Card>
      )}

      {/* 2. E-Commerce Metrics & Activity Card */}
      <Card className="p-3.5 space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
            E-Commerce Activity
          </span>
        </h4>

        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 block uppercase">Orders</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{customer.totalOrders}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 block uppercase">Spent</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">৳{customer.totalSpent}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 block uppercase">Avg Order</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">৳{avgOrderValue}</span>
          </div>
        </div>

        {/* Recent Order Status */}
        {customer.lastOrderNumber && (
          <div className="p-2 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-lg text-xs space-y-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                <PackageCheck className="w-3 h-3 text-indigo-500" />
                {customer.lastOrderNumber}
              </span>
              <span className="text-[10px] text-slate-400">{customer.lastOrderDate}</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 truncate">
              {customer.lastOrderStatus}
            </p>
          </div>
        )}
      </Card>

      {/* 3. Art Specialty & CRM Agent Notes */}
      {(customer.preferredMedium || customer.notes) && (
        <Card className="p-3.5 space-y-2 text-xs">
          {customer.preferredMedium && (
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Palette className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="font-medium">Art Specialty:</span>
              <span className="text-purple-600 dark:text-purple-300 font-semibold truncate">{customer.preferredMedium}</span>
            </div>
          )}

          {customer.notes && (
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-snug">{customer.notes}</p>
            </div>
          )}
        </Card>
      )}

      {/* 4. Embedded Temporary Inventory & Offers Lookup Widget */}
      <div className="flex-1 min-h-0">
        <TemporaryInventoryWidget onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default CustomerInfoPanel;
