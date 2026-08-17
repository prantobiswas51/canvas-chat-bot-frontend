import apiClient from '@/services/apiClient';
import { Conversation, ConversationStatus, ChatMessage, ChatAttachment } from '@/types/chat';

// The list endpoint doesn't include the full thread — messages are fetched
// separately per-conversation once selected. Stubbing `messages: []` keeps the
// object shape-compatible with the shared `Conversation` type used across the UI.
type ConversationSummary = Omit<Conversation, 'messages'>;

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const { data } = await apiClient.get<ConversationSummary[]>('/conversations');
    return data.map((c) => ({ ...c, messages: [] }));
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data } = await apiClient.get<ChatMessage[]>(`/conversations/${conversationId}/messages`);
    return data;
  },

  async sendMessage(conversationId: string, content: string, attachment?: ChatAttachment): Promise<ChatMessage> {
    const { data } = await apiClient.post<ChatMessage>(`/conversations/${conversationId}/messages`, {
      content,
      attachment,
    });
    return data;
  },

  async updateStatus(conversationId: string, status: ConversationStatus): Promise<void> {
    await apiClient.patch(`/conversations/${conversationId}/status`, { status });
  },

  async assignModerator(conversationId: string, moderatorId: string): Promise<void> {
    await apiClient.patch(`/conversations/${conversationId}/assign`, { moderatorId });
  },
};

export default chatService;
