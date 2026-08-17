import apiClient from '@/services/apiClient';

// Only the channels the backend's channel_accounts table actually supports —
// narrower than the frontend's broader ChannelType (which also has
// 'website_widget', not a connectable external channel here).
export type ConnectableChannel = 'whatsapp' | 'messenger' | 'instagram';

export interface ChannelAccountSummary {
  id: string;
  channel: ConnectableChannel;
  externalAccountId: string;
  displayName: string;
  createdAt: string;
}

export interface CreateChannelPayload {
  channel: ConnectableChannel;
  externalAccountId: string;
  displayName: string;
  accessToken?: string;
}

export const channelService = {
  async list(): Promise<ChannelAccountSummary[]> {
    const { data } = await apiClient.get<ChannelAccountSummary[]>('/channels');
    return data;
  },

  async create(payload: CreateChannelPayload): Promise<ChannelAccountSummary> {
    const { data } = await apiClient.post<ChannelAccountSummary>('/channels', payload);
    return data;
  },
};

export default channelService;
