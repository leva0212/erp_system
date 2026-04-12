import { searchVariants } from "@/infrastructure/repositories/variantRepository";

export async function searchVariantsUseCase(filters?: {
  search?: string;
  productId?: number;
  onlyStock?: boolean;
}) {
  return await searchVariants(filters);
}