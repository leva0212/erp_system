import { supabaseVariantRepository } from "../infrastructure/supabaseVariantRepository";

export async function updateVariant(id: number, data: any) {
  return supabaseVariantRepository.update(id, data)
}