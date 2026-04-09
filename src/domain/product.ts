// domain/product.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

export interface Variant {
  id?: number;
  product_id?: number;
  sku: string;
  price: number;
  active: boolean;
}