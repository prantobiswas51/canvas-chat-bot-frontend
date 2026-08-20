import apiClient from '@/services/apiClient';

// OpenAI/Claude removed while debugging Gemini 429s — backend only accepts
// 'gemini' now (see ai-settings entity/dto on the backend).
export type AiProviderName = 'gemini';

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
