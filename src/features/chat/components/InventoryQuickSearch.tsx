import React, { useState } from 'react';
import { MOCK_INVENTORY } from '@/services/inventoryService';
import Badge from '@/components/ui/Badge';
import { Search, PackageCheck, Copy, Check } from 'lucide-react';

export const InventoryQuickSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const filteredProducts = MOCK_INVENTORY.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
  );

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <PackageCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Canvas Inventory Lookup</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Live DB</span>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product, SKU..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors flex items-center gap-3"
          >
            {prod.imageUrl && (
              <img
                src={prod.imageUrl}
                alt={prod.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-1">
                <h5 className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight">
                  {prod.name}
                </h5>
                <button
                  type="button"
                  onClick={() => handleCopySku(prod.sku)}
                  title="Copy SKU"
                  className="text-slate-400 hover:text-indigo-400 p-0.5 rounded cursor-pointer shrink-0"
                >
                  {copiedSku === prod.sku ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="font-bold text-emerald-400">৳{prod.price} BDT</span>
                <Badge variant={prod.stock > 20 ? 'success' : 'warning'} size="sm">
                  Stock: {prod.stock}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryQuickSearch;
