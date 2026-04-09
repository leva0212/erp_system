import { Product } from "../domain/product";
import {
  getProducts,
  createProduct,
  updateProduct,
  getVariants,
  createVariant,
  updateVariant,
  GetProductsParams,
  GetProductsResult,
} from "./productService";

// Definir tipo de Variant si no existe
export interface Variant {
  id?: number;
  sku: string;
  price: number;
  active: boolean;
  attributes?: any[];
  product_id?: number;
}

export class ProductUseCase {
  async loadProducts(params: GetProductsParams): Promise<GetProductsResult> {
    return await getProducts(params);
  }

  async loadVariants(productId: number): Promise<Variant[]> {
    return await getVariants(productId);
  }

  async saveProduct(product: Product, variants: Variant[]): Promise<number> {
    // Aseguramos que description nunca sea undefined
    const productId =
      product.id ??
      (await createProduct({
        name: product.name ?? "",
        description: product.description ?? "",
        active: product.active ?? true,
      }));

    for (const v of variants) {
      const variantData = {
        ...v,
        product_id: productId,
      };

      if (v.id) await updateVariant(v.id, variantData);
      else await createVariant(variantData);
    }

    return productId;
  }

  async updateProduct(product: Product): Promise<void> {
    await updateProduct(product.id, {
      name: product.name ?? "",
      description: product.description ?? "",
      active: product.active ?? true,
    });
  }
}