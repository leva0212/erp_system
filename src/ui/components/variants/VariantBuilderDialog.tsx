"use client";

import { useState } from "react";

import VariantBulkEditor from "./VariantBulkEditor";
import { generateVariantsUseCase } from "@/application/variants/generateVariantsUseCase";
import VariantPreviewTable from "./VariantPreviewTable";
export default function VariantBuilderDialog({
  product,
  attributes,
}: any) {

  // 🔥 AQUÍ VA TU STATE (IMPORTANTE)
  const [variants, setVariants] = useState<any[]>([]);

  const [selected, setSelected] = useState<any>({});

  const toggleValue = (attrId: string, value: any) => {
    setSelected((prev: any) => {
      const current = prev[attrId] || [];
      const exists = current.find((v: any) => v.id === value.id);

      return {
        ...prev,
        [attrId]: exists
          ? current.filter((v: any) => v.id !== value.id)
          : [...current, value],
      };
    });
  };

  const buildAttributes = () => {
    return Object.entries(selected).map(([attrId, values]: any) => ({
      attributeId: attrId,
      values,
    }));
  };

  // 🔥 AQUÍ VA TU GENERATE (IMPORTANTE)
  const generate = () => {
    const result = generateVariantsUseCase({
      productName: product.name,
      attributes: buildAttributes(),
    });

    setVariants(result);
  };

  return (
    <div className="p-4 space-y-4">

      <h2 className="text-xl font-bold">
        Variant Builder
      </h2>

      {/* ATRIBUTOS */}
      {attributes.map((attr: any) => (
        <div key={attr.id} className="border p-3 rounded">
          <h3 className="font-semibold">{attr.name}</h3>

          <div className="flex gap-2 flex-wrap mt-2">
            {attr.values.map((val: any) => (
              <button
                key={val.id}
                onClick={() => toggleValue(attr.id, val)}
                className={`px-3 py-1 border rounded ${
                  selected[attr.id]?.find((v: any) => v.id === val.id)
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {val.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* BOTÓN GENERAR */}
      <button
        onClick={generate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generar variantes
      </button>

      {/* 🔥 AQUÍ VAN LAS TABLAS (IMPORTANTE) */}
      {variants.length > 0 && (
        <div className="space-y-4 mt-6">

          <VariantPreviewTable
            variants={variants}
            setVariants={setVariants}
          />

          <VariantBulkEditor
            variants={variants}
            setVariants={setVariants}
          />

        </div>
      )}
    </div>
  );
}