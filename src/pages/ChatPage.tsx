import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ConversationList from '@/features/chat/components/ConversationList';
import ChatWindow from '@/features/chat/components/ChatWindow';
import CustomerInfoPanel from '@/features/chat/components/CustomerInfoPanel';
import InboxCategoryNavBar from '@/features/chat/components/InboxCategoryNavBar';
import chatService from '@/services/chatService';
import userService from '@/services/userService';
import { getSocket } from '@/services/socket';
import { withDummyCrmData } from '@/features/chat/utils/dummyCustomerCrm';
import { Conversation, ConversationCategory, ConversationStatus, ChatMessage, ChatAttachment, Moderator } from '@/types/chat';
import { User, UserRole } from '@/types/auth';

// The Moderator type (used for the chat assignment dropdown) has a richer,
// display-oriented role set than the auth UserRole enum — map between them.
function toModeratorRole(role: UserRole): Moderator['role'] {
  switch (role) {
    case 'superadmin':
    case 'admin':
      return 'Senior Moderator';
    case 'manager':
      return 'Sales Executive';
    default:
      return 'Support Specialist';
  }
}

function toModerator(user: User): Moderator {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatarUrl,
    role: toModeratorRole(user.role),
    status: 'online',
    isAi: false,
  };
}

export const ChatPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ConversationCategory>('all');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moderators, setModerators] = useState<Moderator[]>([]);

  // Read inside socket callbacks registered once on mount — a ref keeps them
  // seeing the latest selection without re-subscribing on every change.
  const selectedConversationIdRef = useRef<string | null>(null);
  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Load the conversation list (left panel) once on mount.
  useEffect(() => {
    let cancelled = false;

    chatService
      .getConversations()
      .then((data) => {
        if (cancelled) return;
        setConversations(data);
        if (data.length > 0) setSelectedConversationId(data[0].id);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load conversations from the server.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingList(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Load the team roster once for the "Assign Moderator" dropdown.
  useEffect(() => {
    userService
      .getAll()
      .then((users) => setModerators(users.map(toModerator)))
      .catch(() => {
        // Non-critical — the assign dropdown just stays empty if this fails.
      });
  }, []);

  // Load the thread whenever a different conversation is selected.
  useEffect(() => {
    if (!selectedConversationId) return;
    let cancelled = false;

    setIsLoadingMessages(true);
    chatService
      .getMessages(selectedConversationId)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load messages for this conversation.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMessages(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedConversationId]);

  // Live updates — appends inbound/outbound messages to an already-open thread
  // and keeps the left-panel previews/unread badges/order in sync without a
  // manual refresh.
  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId !== selectedConversationIdRef.current) return;
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
    };

    const handleConversationUpdated = (conversation: Conversation) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === conversation.id);
        const merged: Conversation = { ...conversation, messages: existing?.messages ?? [] };
        const rest = prev.filter((c) => c.id !== conversation.id);
        return [merged, ...rest];
      });
    };

    socket.on('message:new', handleNewMessage);
    socket.on('conversation:updated', handleConversationUpdated);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, []);

  const handleSendMessage = useCallback(
    async (text: string, attachment?: ChatAttachment) => {
      if (!selectedConversationId || (!text.trim() && !attachment)) return;

      const sentMessage = await chatService.sendMessage(selectedConversationId, text, attachment);
      // Dedupe against the socket's own "message:new" echo of this same send.
      setMessages((prev) => (prev.some((m) => m.id === sentMessage.id) ? prev : [...prev, sentMessage]));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? { ...c, lastMessage: sentMessage.content, lastMessageTime: sentMessage.timestamp, unreadCount: 0 }
            : c,
        ),
      );
    },
    [selectedConversationId],
  );

  const handleToggleStatus = useCallback(
    async (status: ConversationStatus) => {
      if (!selectedConversationId) return;

      // Optimistic update — revert if the save fails.
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConversationId ? { ...c, status } : c)),
      );

      try {
        await chatService.updateStatus(selectedConversationId, status);
      } catch {
        setError('Could not save the AI/human status change.');
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversationId
              ? { ...c, status: status === 'ai_active' ? 'human_moderator' : 'ai_active' }
              : c,
          ),
        );
      }
    },
    [selectedConversationId],
  );

  const handleAssignModerator = useCallback(
    async (moderatorId: string | null) => {
      if (!selectedConversationId) return;

      const current = conversations.find((c) => c.id === selectedConversationId);
      const previousModeratorId = current?.assignedModeratorId;
      const previousStatus = current?.status;

      // Optimistic update — revert if the save fails. Reassigning to AI
      // (moderatorId: null) also flips status back to ai_active, matching
      // what the backend does (see ChatService.assignModerator).
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? {
                ...c,
                assignedModeratorId: moderatorId ?? undefined,
                status: moderatorId ? c.status : 'ai_active',
              }
            : c,
        ),
      );

      try {
        await chatService.assignModerator(selectedConversationId, moderatorId);
      } catch {
        setError(moderatorId ? 'Could not assign the moderator.' : 'Could not reassign this chat to AI.');
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversationId
              ? { ...c, assignedModeratorId: previousModeratorId, status: previousStatus ?? c.status }
              : c,
          ),
        );
      }
    },
    [selectedConversationId, conversations],
  );

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <div className="h-[calc(100vh-4rem)] -m-4 md:-m-6 flex flex-col overflow-hidden bg-slate-950">
      <InboxCategoryNavBar
        conversations={conversations}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="flex-1 flex overflow-hidden min-h-0">
        {isLoadingList ? (
          <div className="flex-1 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
            {error ?? 'No conversations yet.'}
          </div>
        ) : (
          <>
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.id ?? ''}
              onSelect={setSelectedConversationId}
              selectedCategory={selectedCategory}
            />

            {selectedConversation && (
              <>
                <ChatWindow
                  conversation={{ ...selectedConversation, messages: isLoadingMessages ? [] : messages }}
                  onSendMessage={handleSendMessage}
                  onToggleStatus={handleToggleStatus}
                  onAssignModerator={handleAssignModerator}
                  moderators={moderators}
                />

                <CustomerInfoPanel
                  customer={withDummyCrmData(selectedConversation.customer)}
                  onSendMessage={handleSendMessage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
