import apiClient from '@/services/apiClient';

export type OrderRecordStatus = 'pending' | 'confirmed' | 'cancelled';

export interface OrderRecord {
  id: string;
  invoiceId: string;
  customerName: string;
  address: string;
  phone: string;
  productSku: string;
  quantity: number;
  unitPrice?: string;
  totalPrice?: string;
  currency: string;
  status: OrderRecordStatus;
  notes?: string;
  createdByAi: boolean;
  conversationId?: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOrders {
  data: OrderRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderStats {
  total: number;
  aiGenerated: number;
}

export interface ListOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderRecordStatus;
}

export const orderService = {
  async list(params: ListOrdersParams = {}): Promise<PaginatedOrders> {
    const { data } = await apiClient.get<PaginatedOrders>('/orders', { params });
    return data;
  },

  async stats(): Promise<OrderStats> {
    const { data } = await apiClient.get<OrderStats>('/orders/stats');
    return data;
  },
};

export default orderService;
