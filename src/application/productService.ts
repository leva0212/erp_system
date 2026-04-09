// src/application/productService.ts
import { supabase } from "../infrastructure/supabaseClient";
import { Product, Variant } from "../domain/product";
import { Attribute, AttributeValue } from "../domain/attribute";

// =====================================
// PRODUCTOS
// =====================================

// Crear producto, devuelve el objeto completo
export async function createProduct(data: {
  name: string;
  description: string;
  active: boolean;
}): Promise<Product> {
  const { data: product, error } = await supabase
    .from("products")
    .insert([data])
    .select("*")
    .single();

  if (error) throw error;
  return product as Product;
}

// Actualizar producto, devuelve el objeto completo actualizado
export async function updateProduct(
  id: number,
  data: { name: string; description: string; active: boolean }
): Promise<Product> {
  const { error } = await supabase.from("products").update(data).eq("id", id);
  if (error) throw error;

  const { data: updatedProduct, error: selectError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (selectError) throw selectError;
  return updatedProduct as Product;
}

// =====================================
// VARIANTES
// =====================================

// Obtener variantes de un producto, incluyendo sus attribute_values
export async function getVariants(productId: number): Promise<Variant[]> {
  const { data, error } = await supabase
    .from("variants")
    .select(`
      *,
      variant_attribute_values (
        attribute_value_id,
        attribute_values(id, value)
      )
    `)
    .eq("product_id", productId);

  if (error) throw error;

  // Mapear la relación a un array de { id, value } para cada variante
  const variants: Variant[] = (data as any[]).map((v) => ({
    id: v.id,
    product_id: v.product_id,
    sku: v.sku,
    price: v.price,
    active: v.active,
    attribute_values: v.variant_attribute_values?.map((av: any) => ({
      id: av.attribute_values.id,
      value: av.attribute_values.value,
    })) || [],
  }));

  return variants;
}

// Crear variante, devuelve el objeto completo, con atributos
export async function createVariant(data: {
  product_id: number;
  sku: string;
  price: number;
  active?: boolean;
  attributeValueIds?: number[]; // IDs de attribute_values
}): Promise<Variant> {
  const { attributeValueIds, ...variantData } = data;

  const { data: variant, error } = await supabase
    .from("variants")
    .insert([variantData])
    .select("*")
    .single();

  if (error) throw error;

  if (attributeValueIds?.length) {
    await setVariantAttributeValues(variant.id, attributeValueIds);
  }

  return getVariants(variant.product_id!).then((variants) =>
    variants.find((v) => v.id === variant.id)!
  );
}

// Actualizar variante, devuelve el objeto completo actualizado
export async function updateVariant(
  id: number,
  data: {
    sku?: string;
    price?: number;
    active?: boolean;
    attributeValueIds?: number[];
  }
): Promise<Variant> {
  const { attributeValueIds, ...variantData } = data;

  const { error } = await supabase.from("variants").update(variantData).eq("id", id);
  if (error) throw error;

  if (attributeValueIds) {
    await setVariantAttributeValues(id, attributeValueIds);
  }

  const { data: variant, error: selectError } = await supabase
    .from("variants")
    .select("*")
    .eq("id", id)
    .single();

  if (selectError) throw selectError;

  // Obtener los attribute_values de la variante
  const [fullVariant] = await getVariants(variant.product_id!);
  return fullVariant;
}

// =====================================
// GESTIÓN DE ATRIBUTOS
// =====================================

export async function getAttributes(): Promise<Attribute[]> {
  const { data, error } = await supabase.from("attributes").select("*");
  if (error) throw error;
  return data || [];
}

export async function getAttributeValues(attributeId: number): Promise<AttributeValue[]> {
  const { data, error } = await supabase
    .from("attribute_values")
    .select("*")
    .eq("attribute_id", attributeId);
  if (error) throw error;
  return data || [];
}

// Guardar la relación variante-atributos
export async function setVariantAttributeValues(
  variantId: number,
  attributeValueIds: number[]
): Promise<void> {
  // Borrar existentes
  await supabase.from("variant_attribute_values").delete().eq("variant_id", variantId);

  // Insertar nuevos
  const rows = attributeValueIds.map((id) => ({ variant_id: variantId, attribute_value_id: id }));
  const { error } = await supabase.from("variant_attribute_values").insert(rows);
  if (error) throw error;
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

  if (!globalFilter) query = query.order("id", { ascending: false });

  if (globalFilter) {
    const terms = globalFilter.split(" ").filter(Boolean);
    const orClauses = terms
      .map((term) => `name.ilike.%${term}%,description.ilike.%${term}%`)
      .join(",");
    query = query.or(orClauses).order("id", { ascending: false });
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const products: Product[] = (data as Product[]) || [];
  return { data: products, rowCount: count || 0 };
}