import { supabase } from "@/src/infrastructure/supabaseClient";
export async function validateVariants(variants: any[]) {

  const errors: string[] = [];

  // =========================
  // 1. DUPLICATED SKU CHECK
  // =========================
  const skus = variants.map(v => v.sku);
  const duplicates = skus.filter(
    (sku, index) => skus.indexOf(sku) !== index
  );

  if (duplicates.length > 0) {
    errors.push(`SKUs duplicados: ${duplicates.join(", ")}`);
  }

  // =========================
  // 2. CHECK DB DUPLICATES
  // =========================
  const { data } = await supabase
    .from("variants")
    .select("sku")
    .in("sku", skus);

  if (data && data.length > 0) {
    errors.push("Algunos SKUs ya existen en base de datos");
  }

  // =========================
  // 3. PRICE VALIDATION
  // =========================
  const invalidPrices = variants.filter(
    v => v.price < 0 || v.price === null
  );

  if (invalidPrices.length > 0) {
    errors.push("Hay precios inválidos");
  }

  // =========================
  // 4. EMPTY VARIANTS

  if (variants.length === 0) {
    errors.push("No hay variantes generadas");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}