import apiClient from '@/services/apiClient';
import { LoginResponse } from '@/types/auth';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },
};

export default authService;
