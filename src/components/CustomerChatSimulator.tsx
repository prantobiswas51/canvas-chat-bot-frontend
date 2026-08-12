import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Smartphone,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { ChannelType, ChatMessage } from '@/types/chat';
import { chatStore, subscribeToChatStore } from '@/services/chatStore';

/**
 * Floating Pop-up Customer Chat Simulator.
 * Styled matching the official Canvas Brand colors (#FF1E56 Crimson & Deep Navy).
 */
export const CustomerChatSimulator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('whatsapp');
  const [inputText, setInputText] = useState('');
  const [, setStoreState] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToChatStore(() => {
      setStoreState((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const activeConv = chatStore.findConversationByChannel(selectedChannel);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    chatStore.sendCustomerSimulatedMessage(selectedChannel, text);
    if (!textToSend) setInputText('');
  };

  const getChannelColor = (channel: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return 'text-emerald-400 border-emerald-800 bg-emerald-950/60';
      case 'messenger':
        return 'text-sky-400 border-sky-800 bg-sky-950/60';
      case 'instagram':
        return 'text-pink-400 border-pink-800 bg-pink-950/60';
      default:
        return 'text-[#FF1E56] border-[#FF1E56]/40 bg-[#FF1E56]/15';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* 1. FLOATING POP-UP ICON BUTTON IN BRAND CRIMSON RED */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-13 h-13 rounded-full bg-[#FF1E56] hover:bg-[#E01348] text-white flex items-center justify-center shadow-xl shadow-[#FF1E56]/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#FF1E56]/50"
          title="Open Customer Chat Simulator"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0F0F23] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0F0F23] rounded-full" />
        </button>
      )}

      {/* 2. CHAT SIMULATOR POPUP WINDOW */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-[#14142B]/95 border border-[#27274D] rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-lg animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header & Close Button */}
          <div className="bg-[#181835] px-4 py-3 border-b border-[#27274D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF1E56]/15 border border-[#FF1E56]/30 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-[#FF1E56]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  Customer View Simulator
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Real-time Inbox Sync</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#202042] transition-colors cursor-pointer"
              title="Close Simulator"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Channel Switcher */}
          <div className="bg-[#101026] p-2 border-b border-[#27274D] flex items-center justify-between gap-1 text-xs">
            <span className="text-[10px] uppercase font-mono text-slate-500 pl-1">Channel:</span>
            <div className="flex items-center gap-1">
              {(['whatsapp', 'messenger', 'instagram'] as ChannelType[]).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2 py-1 rounded text-[11px] font-mono capitalize transition-all cursor-pointer border ${
                    selectedChannel === ch
                      ? getChannelColor(ch) + ' font-semibold shadow-sm'
                      : 'bg-[#181835] text-slate-400 border-[#27274D] hover:text-slate-200'
                  }`}
                >
                  {ch === 'whatsapp' ? 'WhatsApp' : ch === 'messenger' ? 'Messenger' : 'Instagram'}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Simulate Buttons */}
          <div className="bg-[#FF1E56]/10 border-b border-[#27274D] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[#FF1E56] font-semibold shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> Try:
            </span>
            <button
              type="button"
              onClick={() => handleSend('Acrylic paint set price & stock?')}
              className="px-2 py-0.5 bg-[#FF1E56]/15 hover:bg-[#FF1E56]/30 border border-[#FF1E56]/40 rounded text-[10px] text-slate-200 shrink-0 cursor-pointer"
            >
              Acrylic Price
            </button>
            <button
              type="button"
              onClick={() => handleSend('Which brush is best for oil painting on canvas?')}
              className="px-2 py-0.5 bg-[#FF1E56]/15 hover:bg-[#FF1E56]/30 border border-[#FF1E56]/40 rounded text-[10px] text-slate-200 shrink-0 cursor-pointer"
            >
              Oil Brush Advice
            </button>
            <button
              type="button"
              onClick={() => handleSend('I need 100 pcs wholesale bulk order')}
              className="px-2 py-0.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 rounded text-[10px] text-rose-200 shrink-0 cursor-pointer"
            >
              Bulk Handoff
            </button>
          </div>

          {/* Messages Thread */}
          <div className="h-72 overflow-y-auto p-3.5 space-y-3 bg-[#0F0F23]">
            {activeConv.messages.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Type a message as customer to test response...
              </div>
            ) : (
              activeConv.messages.map((m: ChatMessage) => {
                const isCustomer = m.sender === 'customer';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 mb-1 px-1 text-[10px] text-slate-500 font-mono">
                      <span>{m.senderName}</span>
                      <span>• {m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed border ${
                        isCustomer
                          ? 'bg-[#1B1B3A] border-[#2E2E59] text-slate-100 rounded-tr-none'
                          : 'bg-[#FF1E56]/10 border-[#FF1E56]/30 text-slate-100 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>

                      {m.handoffReason && (
                        <div className="mt-1.5 pt-1.5 border-t border-amber-800/40 text-[10px] text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Handoff: {m.handoffReason}</span>
                        </div>
                      )}

                      {m.referencedProducts && m.referencedProducts.length > 0 && (
                        <div className="mt-1.5 pt-1.5 border-t border-[#FF1E56]/20 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#FF1E56]" />
                          {m.referencedProducts.map((sku) => (
                            <span
                              key={sku}
                              className="text-[10px] font-mono text-[#FF1E56] bg-[#FF1E56]/15 px-1 py-0.2 rounded border border-[#FF1E56]/30"
                            >
                              SKU: {sku}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Customer Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#14142B] border-t border-[#27274D] flex items-end gap-2"
          >
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Send message as ${selectedChannel} user...`}
              className="flex-1 bg-[#0B0B1E] border border-[#27274D] rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#FF1E56] resize-none overflow-y-auto max-h-28 min-h-[34px] leading-snug"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3 py-1.5 bg-[#FF1E56] hover:bg-[#E01348] disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-sm mb-0.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerChatSimulator;
