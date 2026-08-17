import React, { useEffect, useRef, useState } from 'react';
import { Search, PackageCheck, Copy, Check, Tag, Send, Plus, GripVertical, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { Offer } from '@/types/offer';
import { MOCK_OFFERS, offerService } from '@/services/offerService';
import { productService, InventoryItem } from '@/services/productService';

export type { InventoryItem };

export interface TemporaryInventoryWidgetProps {
  className?: string;
  onSendMessage?: (text: string) => void;
}

export const TemporaryInventoryWidget: React.FC<TemporaryInventoryWidgetProps> = ({
  className = '',
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'offers'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSku, setCopiedSku] = useState<string | null>(null);
  const [copiedOfferId, setCopiedOfferId] = useState<string | null>(null);

  // Offers state
  const [offersList, setOffersList] = useState<Offer[]>(MOCK_OFFERS);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    code: '',
    discountText: '',
    description: '',
    validUntil: '31 Dec 2026',
  });

  // Live product search — hits the store's real catalog API on the backend
  // (debounced) instead of filtering static mock data.
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const searchRequestId = useRef(0);

  useEffect(() => {
    if (activeTab !== 'products') return;

    // Don't hit the catalog API until the moderator has actually typed
    // something — avoids an unnecessary request on every panel open.
    if (!searchQuery.trim()) {
      searchRequestId.current += 1;
      setProducts([]);
      setIsSearchingProducts(false);
      setProductError(null);
      return;
    }

    const requestId = ++searchRequestId.current;
    setIsSearchingProducts(true);
    setProductError(null);

    const timer = setTimeout(() => {
      productService
        .search(searchQuery)
        .then((results) => {
          if (searchRequestId.current !== requestId) return; // stale response
          setProducts(results);
        })
        .catch(() => {
          if (searchRequestId.current !== requestId) return;
          setProductError('Could not load products. Please try again.');
        })
        .finally(() => {
          if (searchRequestId.current !== requestId) return;
          setIsSearchingProducts(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const filteredProducts = products;

  const filteredOffers = offersList.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const handleCopyOfferCode = (offer: Offer) => {
    navigator.clipboard.writeText(offer.code);
    setCopiedOfferId(offer.id);
    setTimeout(() => setCopiedOfferId(null), 2000);
  };

  const handleSendOfferToChat = (offer: Offer) => {
    const formattedText = offerService.formatOfferForChat(offer);
    if (onSendMessage) {
      onSendMessage(formattedText);
    } else {
      navigator.clipboard.writeText(formattedText);
      alert('Offer message copied to clipboard!');
    }
  };

  const handleDragStartOffer = (e: React.DragEvent, offer: Offer) => {
    const formattedText = offerService.formatOfferForChat(offer);
    e.dataTransfer.setData('text/plain', formattedText);
    e.dataTransfer.setData('application/json', JSON.stringify(offer));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.title || !newOffer.code) return;

    const created: Offer = {
      id: `off-custom-${Date.now()}`,
      title: newOffer.title,
      code: newOffer.code.toUpperCase(),
      discountText: newOffer.discountText || 'Special Discount',
      description: newOffer.description || 'Exclusive offer for valued Canvas customer.',
      validUntil: newOffer.validUntil || 'Limited time',
      badgeColor: 'pink',
    };

    setOffersList([created, ...offersList]);
    setIsAddingOffer(false);
    setNewOffer({ title: '', code: '', discountText: '', description: '', validUntil: '31 Dec 2026' });
  };

  return (
    <div className={`bg-slate-100 dark:bg-[#14142B]/90 border border-slate-200 dark:border-[#27274D] rounded-xl p-4 flex flex-col space-y-3 font-sans ${className}`}>
      {/* Tab Header Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27274D] pb-2.5">
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-[#0B0B1E] p-1 rounded-lg border border-slate-300 dark:border-[#27274D]">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Products</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-[#F81B57] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Offers</span>
            {offersList.length > 0 && (
              <span className="ml-0.5 bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {offersList.length}
              </span>
            )}
          </button>
        </div>

        <span className="text-[10px] font-mono text-slate-500 bg-slate-200 dark:bg-[#0F0F23] border border-slate-300 dark:border-[#27274D] px-2 py-0.5 rounded">
          Live DB
        </span>
      </div>

      {/* Search Bar & Action Header */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'products' ? 'Search product, SKU...' : 'Search offers, promo code...'}
            className="w-full bg-white dark:bg-[#0B0B1E] border border-slate-300 dark:border-[#27274D] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57] transition-colors"
          />
        </div>

        {activeTab === 'offers' && (
          <button
            type="button"
            onClick={() => setIsAddingOffer(!isAddingOffer)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F81B57] hover:bg-[#d01345] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
            title="Create Pre-set Offer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        )}
      </div>

      {/* Add New Offer Expandable Form */}
      {activeTab === 'offers' && isAddingOffer && (
        <form onSubmit={handleCreateOffer} className="p-3 bg-white dark:bg-[#0B0B1E] border border-[#F81B57]/50 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 text-xs">
            <span className="flex items-center gap-1.5 text-[#F81B57]">
              <Sparkles className="w-3.5 h-3.5" /> Pre-set New Offer
            </span>
            <button
              type="button"
              onClick={() => setIsAddingOffer(false)}
              className="text-slate-400 hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Offer Title (e.g. Eid Special Bundle)"
            value={newOffer.title}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            required
            className="w-full bg-slate-100 dark:bg-[#181835] border border-slate-300 dark:border-[#27274D] rounded px-2.5 py-1 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Promo Code (e.g. EID20)"
              value={newOffer.code}
              onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
              required
              className="bg-slate-100 dark:bg-[#181835] border border-slate-300 dark:border-[#27274D] rounded px-2.5 py-1 font-mono uppercase text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
            />
            <input
              type="text"
              placeholder="Discount (e.g. 20% OFF)"
              value={newOffer.discountText}
              onChange={(e) => setNewOffer({ ...newOffer, discountText: e.target.value })}
              className="bg-slate-100 dark:bg-[#181835] border border-slate-300 dark:border-[#27274D] rounded px-2.5 py-1 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
            />
          </div>
          <input
            type="text"
            placeholder="Short Offer Description..."
            value={newOffer.description}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
            className="w-full bg-slate-100 dark:bg-[#181835] border border-slate-300 dark:border-[#27274D] rounded px-2.5 py-1 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
          />
          <button
            type="submit"
            className="w-full py-1.5 bg-[#F81B57] hover:bg-[#d01345] text-white font-semibold rounded transition-colors text-xs cursor-pointer"
          >
            Save Pre-set Offer
          </button>
        </form>
      )}

      {/* Main List Container */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {/* PRODUCTS TAB CONTENT */}
        {activeTab === 'products' && (
          isSearchingProducts ? (
            <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Searching products...
            </div>
          ) : productError ? (
            <div className="p-4 flex items-center justify-center gap-1.5 text-xs text-red-500 text-center">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {productError}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              {searchQuery ? `No products match "${searchQuery}"` : 'Type to search the product catalog'}
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                draggable
                onDragStart={(e) => {
                  const txt = `📦 **Product Inquiry**: ${prod.name} (SKU: \`${prod.sku}\`) - Price: ৳${prod.price} BDT [In Stock: ${prod.stock}]${
                    prod.url ? `\n🔗 ${prod.url}` : ''
                  }`;
                  e.dataTransfer.setData('text/plain', txt);
                  e.dataTransfer.setData('application/json', JSON.stringify({ type: 'product', product: prod }));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="p-2.5 bg-white dark:bg-[#181835] border border-slate-200 dark:border-[#27274D] rounded-xl hover:border-[#F81B57]/50 transition-colors flex items-center gap-3 cursor-grab active:cursor-grabbing"
              >
                {prod.imageUrl && (
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-200 dark:bg-[#0B0B1E] border border-slate-200 dark:border-[#27274D] shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1.5">
                    <h4 className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight line-clamp-2">{prod.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleCopySku(prod.sku)}
                      title="Copy SKU"
                      className="text-slate-400 hover:text-[#F81B57] p-1 rounded transition-colors cursor-pointer shrink-0"
                    >
                      {copiedSku === prod.sku ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ৳{prod.price} {prod.currency}
                    </span>
                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
                      prod.stock > 25
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/60'
                    }`}>
                      Stock: {prod.stock}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )
        )}

        {/* OFFERS TAB CONTENT */}
        {activeTab === 'offers' && (
          filteredOffers.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No offers match "{searchQuery}"
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                draggable
                onDragStart={(e) => handleDragStartOffer(e, offer)}
                className="p-3 bg-white dark:bg-[#181835] border border-slate-200 dark:border-[#27274D] rounded-xl hover:border-[#F81B57] transition-all space-y-2 cursor-grab active:cursor-grabbing group shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {offer.title}
                    </h4>
                  </div>
                  <span className="bg-[#F81B57]/15 text-[#F81B57] dark:bg-[#F81B57]/20 border border-[#F81B57]/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {offer.discountText}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                  {offer.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#27274D]/80 text-xs">
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="text-slate-400">Code:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyOfferCode(offer)}
                      className="bg-slate-100 dark:bg-[#0B0B1E] px-1.5 py-0.5 rounded border border-slate-300 dark:border-[#27274D] text-indigo-600 dark:text-indigo-300 font-bold hover:border-indigo-400 cursor-pointer flex items-center gap-1"
                      title="Click to copy promo code"
                    >
                      {offer.code}
                      {copiedOfferId === offer.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendOfferToChat(offer)}
                    className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-300 text-[11px] font-medium px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/60 transition-colors cursor-pointer"
                    title="Send offer into customer chat"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 italic text-right">
                  💡 Drag card to drop directly into chat window
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default TemporaryInventoryWidget;

