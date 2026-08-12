import { Offer } from '@/types/offer';

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: 'Monsoon Artist Combo Deal',
    code: 'CANVAS15',
    discountText: '15% OFF',
    description: 'Get 15% flat discount on Acrylic Paint Set + Brush Bundle purchase.',
    validUntil: '31 Aug 2026',
    badgeColor: 'pink',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'off-2',
    title: 'Free Express Shipping BD',
    code: 'FREESHIP',
    discountText: 'Free Shipping',
    description: 'Free home delivery across Bangladesh for any order over ৳2,000 BDT.',
    validUntil: '30 Sep 2026',
    badgeColor: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1579783901586-d88da7137fc3?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'off-3',
    title: 'New Customer Welcome Voucher',
    code: 'WELCOME10',
    discountText: '10% OFF',
    description: 'Welcome voucher for first-time shoppers on all Canvas art supplies.',
    validUntil: '31 Dec 2026',
    badgeColor: 'indigo',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'off-4',
    title: 'Watercolor Pan Set Special',
    code: 'WTR300',
    discountText: '৳300 OFF',
    description: 'Instant ৳300 price reduction on Canvas Artists Water Colour Pan Set 24.',
    validUntil: '15 Aug 2026',
    badgeColor: 'amber',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'off-5',
    title: 'VIP Master Artist Coupon',
    code: 'VIP20',
    discountText: '20% OFF',
    description: 'Exclusive 20% discount coupon code reserved for loyal repeat customers.',
    validUntil: '31 Dec 2026',
    badgeColor: 'pink',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
  },
];

export const offerService = {
  getOffers(): Offer[] {
    return MOCK_OFFERS;
  },
  formatOfferForChat(offer: Offer): string {
    return `🎉 **Special Offer for You!**
🏷️ **${offer.title}**
💬 ${offer.description}
🎁 **Discount**: ${offer.discountText}
🔑 **Promo Code**: \`${offer.code}\`
⏰ *Valid until ${offer.validUntil || 'Limited time'}*`;
  },
};

export default offerService;
