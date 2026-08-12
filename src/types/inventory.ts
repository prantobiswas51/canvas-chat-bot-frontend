export type ProductCategory = 
  | 'Acrylic Paints'
  | 'Watercolors'
  | 'Oil Paints'
  | 'Brushes & Tools'
  | 'Canvases & Surfaces'
  | 'Mediums & Varnish'
  | 'Drawing & Sketching';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  currency: string;
  stock: number;
  inStock: boolean;
  description: string;
  imageUrl?: string;
  mediumRecommended?: string[];
  tags: string[];
}
