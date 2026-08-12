export interface Offer {
  id: string;
  title: string;
  code: string;
  discountText: string;
  description: string;
  validUntil?: string;
  badgeColor?: 'pink' | 'emerald' | 'amber' | 'indigo';
  imageUrl?: string;
}
