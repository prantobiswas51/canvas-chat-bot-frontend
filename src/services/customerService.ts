import apiClient from '@/services/apiClient';

export const customerService = {
  async updateNotes(customerId: string, notes: string): Promise<void> {
    await apiClient.patch(`/customers/${customerId}/notes`, { notes });
  },
};

export default customerService;
