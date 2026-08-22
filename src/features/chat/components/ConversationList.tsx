import React, { useState } from 'react';
import { Conversation, ChannelType, ConversationStatus, ConversationCategory } from '@/types/chat';
import Badge from '@/components/ui/Badge';
import { MessageSquare, Search } from 'lucide-react';

export interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  selectedCategory?: ConversationCategory;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  selectedCategory = 'all',
}) => {
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getChannelBadge = (channel: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">WhatsApp</span>;
      case 'messenger':
        return <span className="text-[10px] text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950/60 px-1.5 py-0.5 rounded font-mono">FB Messenger</span>;
      case 'instagram':
        return <span className="text-[10px] text-[#F81B57] dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60 px-1.5 py-0.5 rounded font-mono">Instagram</span>;
      default:
        return <span className="text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">Widget</span>;
    }
  };

  const getStatusBadge = (status: ConversationStatus) => {
    if (status === 'ai_active') return <Badge variant="indigo" size="sm" dot>AI Active</Badge>;
    if (status === 'human_moderator') return <Badge variant="warning" size="sm" dot>Human Handoff</Badge>;
    return <Badge variant="neutral" size="sm">Resolved</Badge>;
  };

  const filteredConversations = conversations.filter((c) => {
    // Channel filter
    const matchesChannel = filterChannel === 'all' || c.channel === filterChannel;
    
    // Search query filter
    const matchesSearch =
      c.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    // Top Category navbar filter
    let matchesCategory = true;
    if (selectedCategory === 'unread') {
      matchesCategory = c.unreadCount > 0;
    } else if (selectedCategory === 'order_requests') {
      matchesCategory = c.category === 'order_requests' || c.lastMessage.toLowerCase().includes('price') || c.lastMessage.toLowerCase().includes('dam');
    } else if (selectedCategory === 'custom_canvas') {
      matchesCategory = c.category === 'custom_canvas' || c.lastMessage.toLowerCase().includes('canvas') || c.customer.tags.includes('Custom Size');
    } else if (selectedCategory === 'art_consult') {
      matchesCategory = c.category === 'art_consult' || c.lastMessage.toLowerCase().includes('brush') || c.lastMessage.toLowerCase().includes('wash');
    } else if (selectedCategory === 'support_handoff') {
      matchesCategory = c.category === 'support_handoff' || c.status === 'human_moderator';
    }

    return matchesChannel && matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full font-sans">
      {/* Search & Channel Filter Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#F81B57]" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Unified Inbox</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">{filteredConversations.length} active</span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chat or customer..."
            className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#F81B57]"
          />
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Channel:</span>
          {['all', 'whatsapp', 'messenger', 'instagram'].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-2 py-0.5 rounded capitalize text-[10px] font-mono font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterChannel === ch
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800/50">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No conversations match "{selectedCategory.replace('_', ' ')}" filter.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`p-3.5 cursor-pointer transition-colors flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-slate-800/80 border-l-3 border-[#F81B57]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-300 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                      {conv.customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
                      {conv.customer.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 truncate pl-9 line-clamp-1">
                  {conv.lastMessage}
                </p>

                <div className="flex items-center justify-between pl-9 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getChannelBadge(conv.channel)}
                    {conv.channelAccountName && (
                      <span
                        className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded font-mono truncate max-w-[120px]"
                        title={conv.channelAccountName}
                      >
                        {conv.channelAccountName}
                      </span>
                    )}
                    {getStatusBadge(conv.status)}
                    {conv.leadSource && (
                      <span className="text-[9px] font-mono text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-1.5 py-0.2 rounded border border-pink-200 dark:border-pink-800/40">
                        {conv.leadSource.type === 'meta_ad' ? '📣 Meta Ad' : conv.leadSource.type === 'google_ad' ? '🎯 Google Ad' : '📱 Organic'}
                      </span>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-[#F81B57] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {conv.unreadCount} unread
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
