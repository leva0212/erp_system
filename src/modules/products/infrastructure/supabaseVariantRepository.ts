import { VariantRepository } from "../domain/variantRepository"
import { Variant } from "../domain/variant"
import { supabase } from "@/modules/shared/lib/supabaseClient"

export const supabaseVariantRepository: VariantRepository = {
  async getAll() {
    const { data, error } = await supabase.from("variants").select("*")
    if (error) throw error
    return data as Variant[]
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("variants")
      .select("*")
      .eq("id", id)
      .single()

    if (error) return null
    return data as Variant
  },

  async search(query) {
    const { data, error } = await supabase
      .from("variants")
      .select("*")
      .ilike("sku", `%${query}%`)

    if (error) throw error
    return data as Variant[]
  },

  async create(data) {
    const { data: res, error } = await supabase
      .from("variants")
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return res as Variant
  },

  async update(id, data) {
    const { data: res, error } = await supabase
      .from("variants")
      .update(data)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return res as Variant
  },
}