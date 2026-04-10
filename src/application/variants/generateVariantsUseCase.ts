import { generateSKU } from "@/src/domain/variants/skuGenerator";
import type { VariantAttributeValue } from "@/src/domain/variants/variantTypes";

let sequence = 1;

export function generateVariantsUseCase(input: {
  productName: string;
  attributes: {
    attributeId: number;
    values: { id: number; value: string }[];
  }[];
}) {
  const combinations = input.attributes.reduce<VariantAttributeValue[][]>(
    (acc, attr) => {
      const result: VariantAttributeValue[][] = [];

      acc.forEach((prev) => {
        attr.values.forEach((val) => {
          result.push([
            ...prev,
            {
              attributeId: Number(attr.attributeId),
              attributeValueId: val.id, // ✅ CRÍTICO
              value: val.value,
            },
          ]);
        });
      });

      return result;
    },
    [[]]
  );

  return combinations.map((combo) => {
    const sku = generateSKU(
      {
        name: input.productName,
      },
      combo
    );

    return {
      sku,
      name: combo.map((c) => c.value).join(" - "),
      price: 0,
      active: true,
      attributes: combo,
    };
  });
}