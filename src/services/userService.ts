import apiClient from '@/services/apiClient';
import { User, UserRole } from '@/types/auth';

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const userService = {
  async signup(payload: SignupPayload): Promise<User> {
    const { data } = await apiClient.post<User>('/users', payload);
    return data;
  },
};

export default userService;
