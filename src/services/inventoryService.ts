import { Product } from '@/types/inventory';
import apiClient from './apiClient';

// Mock inventory database representing real-time Canvas inventory
export const MOCK_INVENTORY: Product[] = [
  {
    id: 'prod-1',
    sku: 'CNV-ACR-500',
    name: 'Canvas Heavy Body Acrylic Paint Set (12 x 75ml)',
    category: 'Acrylic Paints',
    price: 1450,
    currency: 'BDT',
    stock: 45,
    inStock: true,
    description: 'Ultra-pigmented heavy body acrylics with rich satin finish. Ideal for impasto and palette knife work.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
    mediumRecommended: ['Canvas', 'Wood', 'Paper'],
    tags: ['acrylic', 'heavy body', 'set', 'paint'],
  },
  {
    id: 'prod-2',
    sku: 'CNV-WTR-24P',
    name: 'Canvas Artists Water Colour Pan Set (24 Half Pans)',
    category: 'Watercolors',
    price: 2200,
    currency: 'BDT',
    stock: 18,
    inStock: true,
    description: 'Professional grade gum arabic watercolors with vibrant transparency and outstanding lightfastness.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=80',
    mediumRecommended: ['Watercolor Paper 300gsm', 'Cotton Rag'],
    tags: ['watercolor', 'half pan', 'professional'],
  },
  {
    id: 'prod-3',
    sku: 'CNV-BRS-SYN6',
    name: 'Canvas Masterstroke Synthetic Sable Brush Set (6 Pcs)',
    category: 'Brushes & Tools',
    price: 890,
    currency: 'BDT',
    stock: 60,
    inStock: true,
    description: 'High-resilience synthetic bristles designed for liquid watercolor washes and fine details.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80',
    mediumRecommended: ['Watercolor', 'Gouache', 'Acrylic'],
    tags: ['brush', 'sable', 'synthetic', 'wash'],
  },
  {
    id: 'prod-4',
    sku: 'CNV-BRS-HOG8',
    name: 'Canvas Imperial Hog Bristle Brush Set (5 Pcs Flat & Filbert)',
    category: 'Brushes & Tools',
    price: 1150,
    currency: 'BDT',
    stock: 25,
    inStock: true,
    description: 'Stiff natural Chunking hog bristle brushes built specifically for heavy oil paint and thick acrylic application.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
    mediumRecommended: ['Oil Paint', 'Heavy Body Acrylic'],
    tags: ['brush', 'hog bristle', 'oil painting', 'filbert'],
  },
  {
    id: 'prod-5',
    sku: 'CNV-OIL-PRO6',
    name: 'Canvas Classic Oil Colour Starter Set (6 x 37ml)',
    category: 'Oil Paints',
    price: 1850,
    currency: 'BDT',
    stock: 12,
    inStock: true,
    description: 'Slow-drying premium oil pigments blended with refined linseed oil. Exceptional blendability.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&auto=format&fit=crop&q=80',
    mediumRecommended: ['Stretched Canvas', 'Canvas Board'],
    tags: ['oil paint', 'starter kit', 'linseed oil'],
  },
  {
    id: 'prod-6',
    sku: 'CNV-CAN-1216',
    name: 'Canvas Stretched Cotton Canvas 100% Duck 12x16 inch (Pack of 2)',
    category: 'Canvases & Surfaces',
    price: 750,
    currency: 'BDT',
    stock: 80,
    inStock: true,
    description: 'Triple-primed acid-free acrylic gesso stretched over pine wood frames.',
    imageUrl: 'https://images.unsplash.com/photo-1579783901586-d88da7137fc3?w=300&auto=format&fit=crop&q=80',
    mediumRecommended: ['Oil', 'Acrylic', 'Mixed Media'],
    tags: ['canvas', 'stretched', 'cotton'],
  },
];

export const inventoryService = {
  // Real API call attempt with fallback to mock data
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get('/products');
      return response.data.data;
    } catch {
      return MOCK_INVENTORY;
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.toLowerCase().trim();
    if (!q) return MOCK_INVENTORY;

    return MOCK_INVENTORY.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  },

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return MOCK_INVENTORY.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
  },
};
