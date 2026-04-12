import { supabase } from "@/modules/shared/lib/supabaseClient"

export async function getVariants(search = "") {
  let query = supabase
    .from("variants")
    .select("id, sku, price, variant_name")
    .limit(50)

  if (search) {
    query = query.ilike("variant_name", `%${search}%`)
  }

  const { data, error } = await query

  if (error) throw error

  return data || []
}