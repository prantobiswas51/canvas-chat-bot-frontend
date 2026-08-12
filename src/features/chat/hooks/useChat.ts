import { useState, useEffect, useCallback } from 'react';
import { Conversation, ConversationStatus } from '@/types/chat';
import { chatStore, subscribeToChatStore } from '@/services/chatStore';

import { ChatAttachment } from '@/types/chat';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(chatStore.getConversations());
  const [selectedConversationId, setSelectedConversationId] = useState<string>('conv-whatsapp-1');

  useEffect(() => {
    const unsubscribe = subscribeToChatStore(() => {
      setConversations([...chatStore.getConversations()]);
    });
    return unsubscribe;
  }, []);

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0] || chatStore.getConversations()[0];

  const sendMessage = useCallback(
    (text: string, attachment?: ChatAttachment) => {
      if (!selectedConversation) return;
      chatStore.sendAgentMessage(selectedConversation.id, text, attachment);
    },
    [selectedConversation]
  );

  const simulateCustomerMessage = useCallback(
    (customerText: string) => {
      if (!selectedConversation) return;
      chatStore.sendCustomerSimulatedMessage(selectedConversation.channel, customerText);
    },
    [selectedConversation]
  );

  const toggleConversationStatus = useCallback(
    (newStatus: ConversationStatus) => {
      if (!selectedConversation) return;
      chatStore.updateStatus(selectedConversation.id, newStatus);
    },
    [selectedConversation]
  );

  const assignModerator = useCallback(
    (moderatorId: string) => {
      if (!selectedConversation) return;
      chatStore.assignModerator(selectedConversation.id, moderatorId);
    },
    [selectedConversation]
  );

  return {
    conversations,
    selectedConversation,
    setSelectedConversationId,
    sendMessage,
    simulateCustomerMessage,
    toggleConversationStatus,
    assignModerator,
    moderators: chatStore.getModerators(),
  };
}
