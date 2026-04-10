import { supabase } from "../supabaseClient";

export async function saveVariants(productId: number, variants: any[]) {

  // 1. Insertar variantes
  const { data: inserted, error } = await supabase
    .from("variants")
    .insert(
      variants.map(v => ({
        product_id: productId,
        sku: v.sku,
        price: v.price,
        active: v.active,
      }))
    )
    .select();

  if (error) throw error;

  // 2. Relaciones atributos
  const relations: any[] = [];

  inserted?.forEach((variant: any, index: number) => {
    variants[index].attributes.forEach((attr: any) => {
      relations.push({
        variant_id: variant.id,
        attribute_value_id: attr.attributeValueId, // ✅ FIX
      });
    });
  });

  const { error: relError } = await supabase
    .from("variant_attribute_values")
    .insert(relations);

  if (relError) throw relError;

  // 3. AUTO STOCK CREATION
  await createInitialStock(inserted.map(v => v.id));

  return inserted;
}

// =====================================
// AUTO STOCK CREATION
// =====================================

async function createInitialStock(variantIds: number[]) {

  const stocks = variantIds.map(id => ({
    variant_id: id,
    warehouse_id: 1, // default: Taller
    quantity: 0,
  }));

  const { error } = await supabase
    .from("inventory_stock")
    .insert(stocks);

  if (error) throw error;
}