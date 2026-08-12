export interface DashboardMetric {
  title: string;
  value: string | number;
  changePercent: number;
  isPositive: boolean;
  period: string;
}

export interface ChannelAnalytics {
  channel: string;
  conversations: number;
  conversions: number;
  aiResolvedRate: number;
}

export interface RecentInquiry {
  id: string;
  customerName: string;
  channel: string;
  topic: 'Inventory' | 'Art Consultation' | 'Bulk Order Handoff' | 'Support';
  status: 'ai_active' | 'human_moderator' | 'resolved';
  timeAgo: string;
}
