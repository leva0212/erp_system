import { useQuery } from "@tanstack/react-query"
import { supabaseProductRepository } from "../../infrastructure/supabaseProductRepository"

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: supabaseProductRepository.getAllVariants,
  })
}