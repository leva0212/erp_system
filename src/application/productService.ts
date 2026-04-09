import { supabase } from "../infrastructure/supabaseClient";
import { Product } from "../domain/product";

// =====================================
// PRODUCTOS
// =====================================

// Crear producto, devuelve ID del nuevo producto
export async function createProduct(data: {
  name: string;
  description: string;
  active: boolean;
}): Promise<number> {
  const { data: product, error } = await supabase
    .from("products")
    .insert([data])
    .select("id")
    .single();

  if (error) throw error;
  return product?.id ?? 0;
}

// Actualizar producto, devuelve true si se actualizó correctamente
export async function updateProduct(
  id: number,
  data: { name: string; description: string; active: boolean }
): Promise<boolean> {
  const { error } = await supabase.from("products").update(data).eq("id", id);
  if (error) throw error;
  return true;
}

// =====================================
// VARIANTES
// =====================================

// Obtener variantes de un producto
export async function getVariants(productId: number): Promise<any[]> {
  const { data, error } = await supabase
    .from("variants")
    .select("*")
    .eq("product_id", productId);

  if (error) throw error;
  return data || [];
}

// Crear variante, devuelve ID del nuevo registro
export async function createVariant(data: {
  product_id: number;
  sku: string;
  price: number;
  active?: boolean;
}): Promise<number> {
  const { data: variant, error } = await supabase
    .from("variants")
    .insert([data])
    .select("id")
    .single();

  if (error) throw error;
  return variant?.id ?? 0;
}

// Actualizar variante, devuelve true si se actualizó correctamente
export async function updateVariant(
  id: number,
  data: { sku?: string; price?: number; active?: boolean }
): Promise<boolean> {
  const { error } = await supabase.from("variants").update(data).eq("id", id);
  if (error) throw error;
  return true;
}

// =====================================
// LISTAR PRODUCTOS CON FILTRO Y PAGINACIÓN
// =====================================
export type GetProductsParams = {
  pageIndex: number;
  pageSize: number;
  globalFilter: string;
};

export type GetProductsResult = {
  data: Product[];
  rowCount: number;
};

export async function getProducts({
  pageIndex,
  pageSize,
  globalFilter,
}: GetProductsParams): Promise<GetProductsResult> {
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(pageIndex * pageSize, pageIndex * pageSize + pageSize - 1);

  if (globalFilter) {
    const terms = globalFilter.split(" ").filter(Boolean);
    const orClauses = terms
      .map((term) => `name.ilike.%${term}%,description.ilike.%${term}%`)
      .join(",");
    query = query.or(orClauses);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const products: Product[] = (data as Product[]) || [];
  return { data: products, rowCount: count || 0 };
}