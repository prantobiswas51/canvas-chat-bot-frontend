import React from 'react';
import { Conversation, ConversationCategory } from '@/types/chat';
import {
  Inbox,
  ShoppingBag,
  Palette,
  Lightbulb,
  Headphones,
  MailWarning,
} from 'lucide-react';

export interface InboxCategoryNavBarProps {
  conversations: Conversation[];
  selectedCategory: ConversationCategory;
  onSelectCategory: (category: ConversationCategory) => void;
}

export const InboxCategoryNavBar: React.FC<InboxCategoryNavBarProps> = ({
  conversations,
  selectedCategory,
  onSelectCategory,
}) => {
  // Compute real-time category counts
  const categoryCounts = {
    all: conversations.length,
    unread: conversations.filter((c) => c.unreadCount > 0).length,
    order_requests: conversations.filter(
      (c) => c.category === 'order_requests' || c.lastMessage.toLowerCase().includes('price') || c.lastMessage.toLowerCase().includes('dam')
    ).length,
    custom_canvas: conversations.filter(
      (c) => c.category === 'custom_canvas' || c.lastMessage.toLowerCase().includes('canvas') || c.customer.tags.includes('Custom Size')
    ).length,
    art_consult: conversations.filter(
      (c) => c.category === 'art_consult' || c.lastMessage.toLowerCase().includes('brush') || c.lastMessage.toLowerCase().includes('wash')
    ).length,
    support_handoff: conversations.filter(
      (c) => c.category === 'support_handoff' || c.status === 'human_moderator'
    ).length,
  };

  const categoriesNav = [
    { id: 'all' as ConversationCategory, label: 'All Messages', icon: Inbox, count: categoryCounts.all },
    { id: 'unread' as ConversationCategory, label: 'Unread', icon: MailWarning, count: categoryCounts.unread, isAlert: true },
    { id: 'order_requests' as ConversationCategory, label: 'Order Requests', icon: ShoppingBag, count: categoryCounts.order_requests },
    { id: 'custom_canvas' as ConversationCategory, label: 'Custom Canvas', icon: Palette, count: categoryCounts.custom_canvas },
    { id: 'art_consult' as ConversationCategory, label: 'Art Consult', icon: Lightbulb, count: categoryCounts.art_consult },
    { id: 'support_handoff' as ConversationCategory, label: 'Support & Handoff', icon: Headphones, count: categoryCounts.support_handoff },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#14132B] border-b border-slate-200 dark:border-[#27264D] px-4 md:px-6 py-2.5 flex items-center justify-center font-sans shrink-0 shadow-xs z-10 sticky top-0 transition-colors">
      {/* Full Width Horizontal Pill Buttons Bar */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar flex-1 max-w-full">
        {categoriesNav.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#F81B57] text-white border-[#F81B57] shadow-md shadow-[#F81B57]/20 scale-102'
                  : 'bg-slate-100 dark:bg-[#1C1B3A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2B2A52] hover:border-[#F81B57]/50 hover:bg-slate-200 dark:hover:bg-[#232247]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : cat.isAlert ? 'text-[#F81B57]' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : cat.isAlert && cat.count > 0
                    ? 'bg-[#F81B57] text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-[#0E0D21] text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InboxCategoryNavBar;
