import { saveVariants } from "@/src/infrastructure/repositories/variantRepository";

 
export async function saveVariantsUseCase(
  productId: number,
  variants: any[]
) {
  return await saveVariants(productId, variants);
}