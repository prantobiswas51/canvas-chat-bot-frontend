import apiClient from '@/services/apiClient';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  imageUrl?: string;
  url?: string;
}

const STOREFRONT_BASE_URL: string =
  (import.meta.env.VITE_STOREFRONT_BASE_URL as string | undefined) ?? 'https://dev.canvasdhaka.com';

// Confirmed shape of GET /api/admin/products?q= on the Canvas Dhaka catalog
// API (proxied through our own GET /products/search): a paginated envelope
// with product rows that carry pricing, stock (per-variant), and images.
interface RawProductImage {
  imageUrl: string;
  isPrimary?: boolean;
}

interface RawProductVariant {
  stockQuantity?: number;
}

interface RawProduct {
  id: number | string;
  sku: string;
  name: string;
  slug?: string;
  sellingPrice?: string | number;
  effectivePrice?: number;
  buyingPrice?: string | number;
  images?: RawProductImage[];
  variants?: RawProductVariant[];
}

interface RawProductSearchResponse {
  status: string;
  data: RawProduct[];
}

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'string' ? parseFloat(value) : (value as number);
  return typeof n === 'number' && !Number.isNaN(n) ? n : fallback;
}

function normalizeProduct(raw: RawProduct): InventoryItem {
  const primaryImage = raw.images?.find((img) => img.isPrimary) ?? raw.images?.[0];
  const totalStock = (raw.variants ?? []).reduce((sum, v) => sum + toNumber(v.stockQuantity), 0);

  return {
    id: String(raw.id),
    sku: raw.sku ?? '—',
    name: raw.name ?? 'Unnamed product',
    price: toNumber(raw.effectivePrice ?? raw.sellingPrice ?? raw.buyingPrice),
    currency: 'BDT',
    stock: totalStock,
    imageUrl: primaryImage?.imageUrl,
    url: raw.slug ? `${STOREFRONT_BASE_URL}/product/${raw.slug}` : undefined,
  };
}

export const productService = {
  async search(query: string): Promise<InventoryItem[]> {
    const { data } = await apiClient.get<RawProductSearchResponse>('/products/search', {
      params: { q: query },
    });
    return (data?.data ?? []).map(normalizeProduct);
  },
};

export default productService;
