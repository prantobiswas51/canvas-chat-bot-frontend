import { CustomerProfile } from '@/types/chat';

// Cosmetic-only CRM enrichment for the right sidebar. The backend doesn't track
// orders/loyalty/lead-attribution yet, so this fills the panel with plausible
// dummy data (deterministic per customer, so it doesn't reshuffle on re-render).
const DUMMY_PROFILES: Array<
  Partial<CustomerProfile> & Pick<CustomerProfile, 'totalOrders' | 'totalSpent' | 'tags'>
> = [
  {
    totalOrders: 4,
    totalSpent: 8400,
    tags: ['Oil Painter', 'Frequent Buyer'],
    tier: 'Gold VIP',
    points: 480,
    city: 'Dhaka',
    address: 'House 42, Road 7/A, Dhanmondi, Dhaka-1209',
    preferredMedium: 'Oil Painting & Heavy Acrylic',
    lastOrderNumber: '#CNV-ORD-8821',
    lastOrderStatus: 'Delivered (Steadfast Courier)',
    lastOrderDate: '28 Jul 2026',
    notes: 'Prefers express delivery. Uses natural hog bristle brushes for impasto.',
    leadSource: {
      type: 'meta_ad',
      platformName: 'Facebook Click-to-WhatsApp Ad',
      campaignName: 'Summer Canvas Brushes Promo 2026',
      adTitle: 'Premium Natural Hog Bristle Oil Brushes',
      adId: 'META-AD-88419',
      clickTimestamp: 'Today at 10:12 AM',
    },
  },
  {
    totalOrders: 12,
    totalSpent: 34500,
    tags: ['Bulk Buyer', 'Art Institute'],
    tier: 'Pro Artist',
    points: 1450,
    city: 'Chittagong',
    address: 'Institute of Fine Arts, Nasirabad, Chittagong',
    preferredMedium: 'Acrylic & Mixed Media',
    lastOrderNumber: '#CNV-ORD-8790',
    lastOrderStatus: 'Delivered (Pathao Parcel)',
    lastOrderDate: '22 Jul 2026',
    notes: 'Institutional buyer. Always inquires about bulk discounts.',
    leadSource: {
      type: 'meta_ad',
      platformName: 'Instagram Sponsored Ad',
      campaignName: 'Heavy Body Acrylic Wholesale Sale',
      adTitle: 'Canvas Heavy Body Acrylic Paint Set (12x75ml)',
      adId: 'META-AD-77210',
      clickTimestamp: 'Today at 10:04 AM',
    },
  },
  {
    totalOrders: 1,
    totalSpent: 1450,
    tags: ['Beginner'],
    tier: 'Bronze Customer',
    points: 120,
    city: 'Sylhet',
    address: 'Zindabazar Commercial Area, Sylhet',
    preferredMedium: 'Watercolors',
    lastOrderNumber: '#CNV-ORD-8650',
    lastOrderStatus: 'Delivered',
    lastOrderDate: '10 Jul 2026',
    notes: 'New watercolor artist, still learning washes.',
  },
  {
    totalOrders: 8,
    totalSpent: 42000,
    tags: ['Wholesale Dealer'],
    tier: 'Pro Artist',
    points: 1890,
    city: 'Rajshahi',
    address: 'Station Road, Rajshahi',
    preferredMedium: 'Bulk Art Supplies',
    lastOrderNumber: '#CNV-ORD-8850',
    lastOrderStatus: 'Processing',
    lastOrderDate: '02 Aug 2026',
    notes: 'Wholesale dealer. Requires custom pricing negotiation.',
  },
];

function hashToIndex(id: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function withDummyCrmData(customer: CustomerProfile): CustomerProfile {
  const dummy = DUMMY_PROFILES[hashToIndex(customer.id, DUMMY_PROFILES.length)];

  return {
    ...customer,
    ...dummy,
    // Keep the real fields from the backend rather than letting dummy data override them.
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    channel: customer.channel,
    tags: customer.tags.length > 0 ? customer.tags : dummy.tags,
  };
}
