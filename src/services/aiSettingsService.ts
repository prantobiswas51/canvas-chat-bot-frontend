import apiClient from '@/services/apiClient';

export type AiProviderName = 'openai' | 'gemini' | 'claude';

export interface AiSettings {
  id: string;
  customInstructions?: string;
  aiEnabledByDefault: boolean;
  aiProvider: AiProviderName;
  updatedAt: string;
}

export interface UpdateAiSettingsPayload {
  customInstructions?: string;
  aiEnabledByDefault?: boolean;
  aiProvider?: AiProviderName;
}

export const aiSettingsService = {
  async get(): Promise<AiSettings> {
    const { data } = await apiClient.get<AiSettings>('/ai-settings');
    return data;
  },

  async update(payload: UpdateAiSettingsPayload): Promise<AiSettings> {
    const { data } = await apiClient.patch<AiSettings>('/ai-settings', payload);
    return data;
  },
};

export default aiSettingsService;
