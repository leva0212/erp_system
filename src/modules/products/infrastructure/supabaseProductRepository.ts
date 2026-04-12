import { supabase } from "@/modules/shared/lib/supabaseClient"

export const supabaseProductRepository = {
  async getAllVariants() {
    const { data, error } = await supabase
      .from("variants")
      .select(`
        id,
        sku,
        price,
        variant_name,
        products (name)
      `)

    if (error) throw error

    return data.map(v => ({
  id: v.id,
  sku: v.sku,
  price: v.price,
  name: v.variant_name || v.products?.[0]?.name,
}))
  },
}