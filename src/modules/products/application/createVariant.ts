import { supabaseVariantRepository } from "../infrastructure/supabaseVariantRepository";

export async function createVariant(data: any) {
  return supabaseVariantRepository.create(data)
}