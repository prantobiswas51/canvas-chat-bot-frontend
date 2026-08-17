import apiClient from '@/services/apiClient';
import { User, UserRole } from '@/types/auth';

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  avatarUrl?: string;
}

export const userService = {
  async signup(payload: SignupPayload): Promise<User> {
    const { data } = await apiClient.post<User>('/users', payload);
    return data;
  },

  async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await apiClient.patch<User>(`/users/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};

export default userService;
