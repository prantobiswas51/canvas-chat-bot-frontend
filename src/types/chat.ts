export type ChannelType = 'whatsapp' | 'messenger' | 'instagram' | 'website_widget';

export type ConversationStatus = 'ai_active' | 'human_moderator' | 'resolved';

export type SenderRole = 'customer' | 'ai_bot' | 'human_agent' | 'system';

export interface ChatAttachment {
  name: string;
  url: string;
  type: 'image' | 'file';
  size?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: SenderRole;
  senderName: string;
  content: string;
  timestamp: string;
  languageDetected?: 'en' | 'bn' | 'banglish';
  handoffReason?: string;
  referencedProducts?: string[]; // Product SKUs or IDs
  attachment?: ChatAttachment;
}

export interface LeadSource {
  type: 'meta_ad' | 'google_ad' | 'organic_social' | 'direct_whatsapp' | 'website_widget';
  platformName: string;
  campaignName?: string;
  adId?: string;
  adTitle?: string;
  adThumbnailUrl?: string;
  adHeadline?: string;
  clickTimestamp?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  channel: ChannelType;
  channelAvatar?: string;
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  // Rich CRM & Customer Service Data
  address?: string;
  city?: string;
  tier?: 'Gold VIP' | 'Silver Member' | 'Bronze Customer' | 'Pro Artist';
  points?: number;
  preferredMedium?: string;
  lastOrderNumber?: string;
  lastOrderStatus?: string;
  lastOrderDate?: string;
  notes?: string;
  leadSource?: LeadSource;
}

export type ConversationCategory = 
  | 'all'
  | 'unread'
  | 'order_requests'
  | 'custom_canvas'
  | 'art_consult'
  | 'support_handoff';

export interface Moderator {
  id: string;
  name: string;
  avatar?: string;
  role: 'AI Assistant' | 'Senior Moderator' | 'Sales Executive' | 'Support Specialist';
  status: 'online' | 'busy' | 'offline';
  isAi?: boolean;
  activeChatsCount?: number;
}

export interface Conversation {
  id: string;
  customer: CustomerProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: ConversationStatus;
  category?: ConversationCategory;
  assignedModeratorId?: string;
  assignedModerator?: Moderator;
  channel: ChannelType;
  messages: ChatMessage[];
  leadSource?: LeadSource;
}
