import { saveVariants } from "@/infrastructure/repositories/variantRepository";

 
export async function saveVariantsUseCase(
  productId: number,
  variants: any[]
) {
  return await saveVariants(productId, variants);
}