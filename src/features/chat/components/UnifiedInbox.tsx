import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  UserCheck,
  Search,
} from 'lucide-react';

// Channel Types
export type Channel = 'WhatsApp' | 'Messenger' | 'Instagram';

// Message Sender Roles
export type MessageSender = 'Customer' | 'Bot' | 'Human Moderator';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  avatar: string;
  channel: Channel;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isAiActive: boolean;
  messages: ChatMessage[];
}

// Realistic Mock Data for Canvas Art Supplies Chatbot Dashboard
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'Tanvir Ahmed',
    avatar: 'TA',
    channel: 'WhatsApp',
    lastMessage: 'Price list for heavy body acrylic paints?',
    timestamp: '10:42 AM',
    unreadCount: 2,
    isAiActive: true,
    messages: [
      {
        id: 'm1',
        sender: 'Customer',
        senderName: 'Tanvir Ahmed',
        content: 'Hello! What is the price for heavy body acrylic paint set?',
        timestamp: '10:40 AM',
      },
      {
        id: 'm2',
        sender: 'Bot',
        senderName: 'Canvas AI Bot',
        content: 'Hello Tanvir! Our "Canvas Heavy Body Acrylic Set (12 x 75ml)" is ৳1,450 BDT. Currently 45 sets in stock.',
        timestamp: '10:41 AM',
      },
      {
        id: 'm3',
        sender: 'Customer',
        senderName: 'Tanvir Ahmed',
        content: 'Is delivery available inside Dhaka?',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Nusrat Jahan',
    avatar: 'NJ',
    channel: 'Messenger',
    lastMessage: 'We need 50 sets of watercolors for our studio.',
    timestamp: '09:15 AM',
    unreadCount: 0,
    isAiActive: false,
    messages: [
      {
        id: 'm201',
        sender: 'Customer',
        senderName: 'Nusrat Jahan',
        content: 'We need 50 sets of watercolors for our studio. Can we get a bulk discount?',
        timestamp: '09:10 AM',
      },
      {
        id: 'm202',
        sender: 'Bot',
        senderName: 'Canvas AI Bot',
        content: 'Thank you! For bulk orders and studio discounts, I am connecting you to our Human Moderator.',
        timestamp: '09:11 AM',
      },
      {
        id: 'm203',
        sender: 'Human Moderator',
        senderName: 'Admin Lead',
        content: 'Hi Nusrat! I am here. We can offer a 15% discount for 50+ sets. Let me prepare a custom invoice for you.',
        timestamp: '09:15 AM',
      },
    ],
  },
  {
    id: 'conv-3',
    customerName: 'Sajid Hossain',
    avatar: 'SH',
    channel: 'WhatsApp',
    lastMessage: 'Which brush is best for oil painting on canvas?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isAiActive: true,
    messages: [
      {
        id: 'm301',
        sender: 'Customer',
        senderName: 'Sajid Hossain',
        content: 'Which brush is best for oil painting on canvas?',
        timestamp: 'Yesterday 4:30 PM',
      },
      {
        id: 'm302',
        sender: 'Bot',
        senderName: 'Canvas AI Bot',
        content: 'For oil painting, natural Hog Bristle brushes are best as they hold heavy body paint. We recommend our "Canvas Imperial Hog Bristle Brush Set" (৳1,150 BDT).',
        timestamp: 'Yesterday 4:31 PM',
      },
    ],
  },
  {
    id: 'conv-4',
    customerName: 'Ayesha Rahman',
    avatar: 'AR',
    channel: 'Instagram',
    lastMessage: 'Do you have 300gsm watercolor paper?',
    timestamp: '2 days ago',
    unreadCount: 0,
    isAiActive: true,
    messages: [
      {
        id: 'm401',
        sender: 'Customer',
        senderName: 'Ayesha Rahman',
        content: 'Do you have 300gsm watercolor paper?',
        timestamp: '2 days ago',
      },
      {
        id: 'm402',
        sender: 'Bot',
        senderName: 'Canvas AI Bot',
        content: 'Yes! We have 100% cotton 300gsm cold-pressed watercolor pads in stock at ৳850 BDT.',
        timestamp: '2 days ago',
      },
    ],
  },
];

export const UnifiedInbox: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>('conv-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');

  const selectedConversation = conversations.find((c) => c.id === selectedId) || conversations[0];

  // Handle sending a new message as a Human Moderator
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'Human Moderator',
      senderName: 'You (Moderator)',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            lastMessage: newMsg.content,
            timestamp: 'Just now',
            isAiActive: false, // Automatically switch to human mode when moderator replies
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    setInputMessage('');
  };

  // Toggle AI Bot active vs Human takeover mode
  const toggleAiMode = () => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedId) {
          return { ...conv, isAiActive: !conv.isAiActive };
        }
        return conv;
      })
    );
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-slate-950 text-slate-100 font-sans border-t border-slate-800/80 antialiased overflow-hidden">

      {/* LEFT COLUMN: CHAT LIST */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900/60 border-r border-slate-800 flex flex-col h-full shrink-0">

        {/* Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm tracking-tight text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Unified Inbox
            </h2>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
              {conversations.length} chats
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedId;

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${isSelected ? 'bg-slate-800/70 border-l-2 border-slate-400' : 'hover:bg-slate-800/30'
                    }`}
                >
                  {/* Customer Avatar */}
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-xs text-slate-300 shrink-0">
                    {conv.avatar}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-semibold text-slate-200 truncate">
                        {conv.customerName}   {/* Channel Badge with Icon */}
                        
                      </h3>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {conv.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mb-1.5">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center justify-between text-[10px]">


                      {/* AI vs Human Mode indicator */}
                      <span className="text-slate-500">
                        {conv.isAiActive ? 'AI Active' : 'Human Mode'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE CHAT WINDOW */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 min-w-0">

        {/* Chat Window Header */}
        <div className="px-5 py-3.5 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-xs text-slate-300">
              {selectedConversation.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  {selectedConversation.customerName}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded bg-slate-900">
                  {selectedConversation.channel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Canvas Art Supplies Customer</p>
            </div>
          </div>

          {/* Mode Switcher Button */}
          <button
            onClick={toggleAiMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${selectedConversation.isAiActive
                ? 'bg-slate-900 text-indigo-300 border-indigo-800/60 hover:bg-slate-800'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-950/60'
              }`}
          >
            {selectedConversation.isAiActive ? (
              <>
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Bot Active</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Human Moderator Active</span>
              </>
            )}
          </button>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {selectedConversation.messages.map((msg) => {
            const isCustomer = msg.sender === 'Customer';
            const isBot = msg.sender === 'Bot';
            const isModerator = msg.sender === 'Human Moderator';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
              >
                {/* Sender Title Header */}
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {isBot && <Bot className="w-3 h-3 text-indigo-400" />}
                  {isModerator && <UserCheck className="w-3 h-3 text-amber-400" />}
                  <span className="text-[11px] font-medium text-slate-400">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">{msg.timestamp}</span>
                </div>

                {/* Chat Bubble with strict KISS Minimal Styling */}
                <div
                  className={`max-w-md lg:max-w-lg rounded-xl px-4 py-2.5 text-xs leading-relaxed border ${isCustomer
                      ? 'bg-slate-900 border-slate-800 text-slate-200 rounded-tl-none'
                      : isBot
                        ? 'bg-slate-900/90 border-indigo-900/60 text-slate-100 rounded-tr-none'
                        : 'bg-slate-800 border-amber-800/50 text-slate-100 rounded-tr-none'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area for Human Moderator */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              selectedConversation.isAiActive
                ? 'Type to take over as Human Moderator...'
                : 'Type your message to customer...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-100 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default UnifiedInbox;
