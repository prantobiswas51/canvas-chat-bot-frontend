import apiClient from '@/services/apiClient';
import { LoginResponse, User } from '@/types/auth';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },

  // Public self-signup — always creates a role: 'member' account with no
  // dashboard access. An admin upgrades the role later via the Users page.
  async signup(name: string, email: string, password: string): Promise<User> {
    const { data } = await apiClient.post<User>('/auth/signup', { name, email, password });
    return data;
  },
};

export default authService;
