import { supabaseVariantRepository } from "../infrastructure/supabaseVariantRepository"

export async function getVariants(query: string) {
  if (!query) return supabaseVariantRepository.getAll()
  return supabaseVariantRepository.search(query)
}