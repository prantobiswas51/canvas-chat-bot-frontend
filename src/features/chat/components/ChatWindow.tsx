import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ConversationStatus, ChatAttachment, Moderator } from '@/types/chat';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Send, Bot, AlertTriangle, Paperclip, Smile, X, FileText, Image as ImageIcon, Shield, ChevronDown, Megaphone, ZoomIn } from 'lucide-react';

export interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (text: string, attachment?: ChatAttachment) => void;
  onSimulateCustomer?: (text: string) => void;
  onToggleStatus: (status: ConversationStatus) => void;
  onAssignModerator?: (moderatorId: string | null) => void;
  moderators?: Moderator[];
}

const EMOJI_LIST = [
  '🎨', '🖌️', 'framed', '🎁', '💰', '📦', '🚚', '👍',
  '❤️', '😊', '🙏', '✨', '🔥', '⚡', '🚀', '💡',
  '🏷️', '📄', '📞', '📍', '✅', '💯', '👏', '😍'
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onSendMessage,
  onAssignModerator,
  moderators = [],
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<ChatAttachment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModeratorDropdown, setShowModeratorDropdown] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  useEffect(() => {
    if (!previewImage) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [previewImage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // No `|| moderators[0]` fallback — an unassigned chat (handled by the AI)
  // should never render as if the first moderator in the list "owns" it.
  const activeModerator =
    conversation.assignedModerator ?? moderators.find((m) => m.id === conversation.assignedModeratorId);

  // Three states for the header badge: a specific moderator has claimed the
  // chat ("Human"), nobody has and the AI is actively replying ("AI"), or
  // nobody has and the AI isn't replying either — e.g. status is
  // 'resolved', or AI Instructions' global toggle is off — ("Unassigned").
  const assignmentState: 'human' | 'ai' | 'unassigned' = conversation.assignedModeratorId
    ? 'human'
    : conversation.status === 'ai_active'
      ? 'ai'
      : 'unassigned';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;

    onSendMessage(inputText.trim(), selectedAttachment || undefined);
    setInputText('');
    setSelectedAttachment(null);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const previewUrl = URL.createObjectURL(file);

    setSelectedAttachment({
      name: file.name,
      url: previewUrl,
      type: isImage ? 'image' : 'file',
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });

    e.target.value = '';
  };

  const handleInsertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleSelectModerator = (modId: string | null) => {
    if (onAssignModerator) {
      onAssignModerator(modId);
    }
    setShowModeratorDropdown(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const isImage = file.type.startsWith('image/');
      setSelectedAttachment({
        name: file.name,
        url: URL.createObjectURL(file),
        type: isImage ? 'image' : 'file',
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
      return;
    }

    const jsonStr = e.dataTransfer.getData('application/json');
    if (jsonStr) {
      try {
        const payload = JSON.parse(jsonStr);
        if (payload.type === 'product' && payload.product) {
          const prod = payload.product;
          const text = `📦 **Product Inquiry**: ${prod.name}\nSKU: \`${prod.sku}\` | Price: ৳${prod.price} ${prod.currency || 'BDT'} [In Stock: ${prod.stock}]${prod.url ? `\n🔗 ${prod.url}` : ''
            }`;
          const attachment: ChatAttachment | undefined = prod.imageUrl
            ? {
              name: prod.name,
              url: prod.imageUrl,
              type: 'image',
              size: `৳${prod.price} BDT`,
            }
            : undefined;

          onSendMessage(text, attachment);
          return;
        }

        if (payload.id && payload.title && payload.code) {
          const offer = payload;
          const text = `🎁 **Exclusive Offer Card**: ${offer.title}\nUse promo code \`${offer.code}\` for **${offer.discountText}**.\n${offer.description}`;
          onSendMessage(text);
          return;
        }
      } catch (err) {
        // Fallback to text below
      }
    }

    const droppedText = e.dataTransfer.getData('text/plain');
    if (droppedText) {
      onSendMessage(droppedText);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 min-w-0 font-sans"
    >
      {/* Drag & Drop Visual Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-[#F81B57]/15 dark:bg-[#F81B57]/20 border-2 border-dashed border-[#F81B57] backdrop-blur-[2px] z-50 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F81B57] text-white flex items-center justify-center shadow-lg shadow-[#F81B57]/40 mb-3 animate-bounce">
            <Paperclip className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Drop File or Offer to Send</h3>
          <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 max-w-xs">
            Release to attach file, image, or offer card directly into conversation 📎
          </p>
        </div>
      )}

      {/* Top Chat Header */}
      <div className="px-5 py-3.5 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-300 dark:border-indigo-800/60 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            {conversation.customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{conversation.customer.name}</h2>
              {/* <span className="text-[11px] text-slate-500 font-mono uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {conversation.channel}
              </span> */}
            </div>
            <p className="text-xs text-slate-500 relative">
              <button
                type="button"
                onClick={() => setShowModeratorDropdown(!showModeratorDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-[#F81B57] transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#F81B57]" />
                <span className="hidden sm:inline text-slate-400 font-normal">Assigned:</span>
                <span className="truncate max-w-[120px]">
                  {conversation.assignedModeratorId ? activeModerator?.name ?? 'Unassigned' : 'Canvas AI Bot'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Orders: <span className="text-indigo-500 font-medium">{conversation.customer.totalOrders}</span> */}
              {/* Spent: <span className="text-emerald-500 font-medium">৳{conversation.customer.totalSpent} BDT</span> */}

              {/* Moderator Picker Popover — anchored to this button (which
                  sits on the left side of the header) instead of the Badge
                  on the right, and opens from the left edge so it doesn't
                  get clipped by the viewport. */}
              {showModeratorDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-1 text-left normal-case">
                <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Assign Team Moderator</span>
                    <span className="text-[#F81B57] font-mono">{moderators.length} Staff</span>
                  </p>
                </div>

                {/* Hands the chat back to the AI — clears assignedModeratorId
                    and flips status to ai_active on the backend, undoing
                    whatever moderator claim/human takeover was in place. */}
                <button
                  type="button"
                  onClick={() => handleSelectModerator(null)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer mb-1 ${!conversation.assignedModeratorId
                      ? 'bg-[#F81B57]/10 dark:bg-[#F81B57]/20 border border-[#F81B57]/30 text-[#F81B57] font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#F81B57]/10 flex items-center justify-center text-xs shrink-0">
                    🤖
                  </div>
                  <div>
                    <p className="leading-tight">Canvas AI Bot</p>
                    <span className="text-[9px] text-slate-400 block font-mono">Auto-reply, no moderator</span>
                  </div>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                {moderators.map((mod) => {
                  const isCurrent = activeModerator?.id === mod.id;

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleSelectModerator(mod.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${isCurrent
                          ? 'bg-[#F81B57]/10 dark:bg-[#F81B57]/20 border border-[#F81B57]/30 text-[#F81B57] font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-[10px] text-indigo-600 dark:text-indigo-300">
                            {mod.isAi ? '🤖' : mod.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${mod.status === 'online'
                                ? 'bg-emerald-500'
                                : mod.status === 'busy'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                          />
                        </div>
                        <div>
                          <p className="leading-tight">{mod.name}</p>
                          <span className="text-[9px] text-slate-400 block font-mono">{mod.role}</span>
                        </div>
                      </div>

                      {mod.activeChatsCount !== undefined && (
                        <span className="text-[9px] font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                          {mod.activeChatsCount} chats
                        </span>
                      )}
                    </button>
                  );
                })}
                </div>
              )}
            </p>

            {/* Ad attribution — only present when this conversation started
                from a Click-to-WhatsApp/Messenger ad (see WebhookService's
                referral capture on the backend). Sits right under the
                Assigned selector so agents immediately see why this
                customer reached out. */}
            {conversation.adReferral && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[#F81B57] max-w-[260px]">
                <Megaphone className="w-3 h-3 shrink-0" />
                <span className="truncate font-semibold">
                  {conversation.adReferral.headline || 'Started from an ad'}
                </span>
                {conversation.adReferral.adId && (
                  <span className="text-slate-400 font-mono shrink-0">· {conversation.adReferral.adId}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mode & Assigned Moderator Controls */}
        <div className="flex items-center gap-2">
          <Badge
            variant={assignmentState === 'human' ? 'danger' : assignmentState === 'ai' ? 'success' : 'neutral'}
            size="sm"
            dot
          >
            {assignmentState === 'human' ? 'Human' : assignmentState === 'ai' ? 'AI' : 'Unassigned'}
          </Badge>

          {/* {conversation.status === 'ai_active' ? (
            <Button variant="outline" size="sm" leftIcon={<UserCheck className="w-3.5 h-3.5 text-amber-500" />}
              onClick={() => onToggleStatus('human_moderator')}>
              Take Over (Human Mode)
            </Button>
          ) : (
            <Button variant="primary" size="sm" leftIcon={<Bot className="w-3.5 h-3.5" />}
              onClick={() => onToggleStatus('ai_active')}>
              Enable Canvas AI Bot
            </Button>
          )} */}

          {/* {conversation.status === 'ai_active' ? (
            <Badge variant="indigo" size="sm" dot>AI Consultant Active</Badge>
          ) : conversation.status === 'human_moderator' ? (
            <Badge variant="warning" size="sm" dot>Human Moderator Active</Badge>
          ) : (
            <Badge variant="neutral" size="sm">Resolved</Badge>
          )} */}


        </div>
      </div>

      {/* Lead Origin & Meta Ad Source Banner */}
      {conversation.leadSource && (
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {conversation.leadSource.adThumbnailUrl ? (
              <img
                src={conversation.leadSource.adThumbnailUrl}
                alt="Ad Creative"
                className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-xs shrink-0">
                AD
              </div>
            )}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.2 rounded border border-pink-500/30 flex items-center gap-1">
                  <Megaphone className="w-3 h-3 text-[#F81B57]" />
                  {conversation.leadSource.platformName}
                </span>
                {conversation.leadSource.adId && (
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {conversation.leadSource.adId}
                  </span>
                )}
              </div>
              <p className="font-semibold text-slate-100 truncate text-xs">
                {conversation.leadSource.adTitle || conversation.leadSource.campaignName}
              </p>
              {conversation.leadSource.adHeadline && (
                <p className="text-[11px] text-slate-400 truncate">
                  "{conversation.leadSource.adHeadline}"
                </p>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60 block">
              {conversation.leadSource.campaignName || 'Meta Sponsored'}
            </span>
            {conversation.leadSource.clickTimestamp && (
              <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                Clicked: {conversation.leadSource.clickTimestamp}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
        {conversation.messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-1.5">
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-800 flex items-center gap-1.5 shadow-xs">
                  <Shield className="w-3 h-3 text-[#F81B57]" />
                  {msg.content}
                  <span className="text-[9px] text-slate-400 ml-1">{msg.timestamp}</span>
                </span>
              </div>
            );
          }

          const isCustomer = msg.sender === 'customer';
          const isBot = msg.sender === 'ai_bot';

          return (
            <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-medium text-slate-500">{msg.senderName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                {isBot && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/40 font-mono">
                    <Bot className="w-3 h-3 text-[#F81B57]" /> Canvas AI
                  </span>
                )}
              </div>

              <div className={`max-w-md lg:max-w-lg rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isCustomer
                  ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  : isBot
                    ? 'bg-indigo-50 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-800/80 text-indigo-900 dark:text-indigo-100 rounded-tr-none'
                    : 'bg-[#F81B57] text-white rounded-tr-none shadow-md shadow-[#F81B57]/20'
                }`}>
                {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                {/* Render Attachment if present */}
                {msg.attachment && (
                  <div className="mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/50">
                    {msg.attachment.type === 'image' ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ url: msg.attachment!.url, name: msg.attachment!.name })}
                        className="group relative block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-xs cursor-zoom-in"
                      >
                        <img src={msg.attachment.url} alt={msg.attachment.name} className="w-full h-auto max-h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-1.5 bg-slate-900/60 text-[10px] text-white flex items-center justify-between font-mono">
                          <span className="truncate">{msg.attachment.name}</span>
                          <span>{msg.attachment.size}</span>
                        </div>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <FileText className="w-4 h-4 text-[#F81B57] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{msg.attachment.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.attachment.size}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {msg.handoffReason && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200 dark:border-indigo-800/60 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Handoff Triggered: {msg.handoffReason}</span>
                  </div>
                )}

                {msg.referencedProducts && msg.referencedProducts.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-800/60 flex items-center gap-2">
                    <span className="text-[11px] font-mono">SKU:</span>
                    {msg.referencedProducts.map((sku) => (
                      <span key={sku} className="bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-200 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-300 dark:border-indigo-700/60">
                        {sku}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Emoji Picker Popover Modal */}
      {showEmojiPicker && (
        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5 z-20 shadow-md">
          <div className="w-full flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Smile className="w-3 h-3 text-[#F81B57]" />
              Quick Emoji Picker
            </span>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </div>
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleInsertEmoji(emoji)}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-lg transition-transform hover:scale-125 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Preview Card */}
      {selectedAttachment && (
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 truncate">
            {selectedAttachment.type === 'image' ? (
              <ImageIcon className="w-4 h-4 text-[#F81B57]" />
            ) : (
              <FileText className="w-4 h-4 text-indigo-500" />
            )}
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedAttachment.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">({selectedAttachment.size})</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAttachment(null)}
            className="text-slate-400 hover:text-rose-500 p-1 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Message Input Box Form */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-end gap-2">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach file or image"
          className="p-2.5 mb-0.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#F81B57] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Emoji Picker Toggle Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Select Emojis"
          className={`p-2.5 mb-0.5 rounded-xl transition-colors cursor-pointer shrink-0 ${showEmojiPicker
              ? 'text-[#F81B57] bg-pink-50 dark:bg-pink-950/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-[#F81B57] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <Smile className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            conversation.status === 'ai_active'
              ? 'Type a message as Human Agent (or attach file/drop offer)...'
              : 'Type your message to customer...'
          }
          className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#F81B57] resize-none overflow-y-auto max-h-40 min-h-[42px] leading-relaxed transition-[height] duration-75"
        />

        <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />} className="shrink-0 mb-0.5">
          Send
        </Button>
      </form>

      {/* Image Lightbox */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out animate-in fade-in duration-150"
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={previewImage.url}
            alt={previewImage.name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-mono"
          >
            {previewImage.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
