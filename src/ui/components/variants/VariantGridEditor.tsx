"use client";

import { useMemo } from "react";
import { useThemeClasses } from "../../providers/useThemeClasses";
 
export type VariantRow = {
  sku: string;
  name: string;
  price: number;
  active: boolean;
  attributes?: any[];
};

type Props = {
  variants: VariantRow[];
  setVariants: (v: VariantRow[]) => void;
};

export default function VariantGridEditor({
  variants,
  setVariants,
}: Props) {
  const t = useThemeClasses();

  // =========================
  // UPDATE FIELD
  // =========================
  const updateVariant = (
    index: number,
    field: keyof VariantRow,
    value: any
  ) => {
    const copy = [...variants];
    copy[index] = {
      ...copy[index],
      [field]: value,
    };
    setVariants(copy);
  };

  return (
    <div className={`${t.surface} border rounded-lg overflow-hidden`}>

      {/* HEADER */}
      <div className={`grid grid-cols-4 gap-2 p-3 border-b ${t.border} ${t.textMuted} text-xs font-semibold`}>
        <div>SKU</div>
        <div>Nombre</div>
        <div>Precio</div>
        <div>Activo</div>
      </div>

      {/* ROWS */}
      <div className="max-h-[400px] overflow-auto">

        {variants.length === 0 && (
          <div className={`p-4 text-sm ${t.textMuted}`}>
            No hay variantes generadas
          </div>
        )}

        {variants.map((v, i) => (
          <div
            key={i}
            className={`grid grid-cols-4 gap-2 p-3 border-b ${t.border} items-center`}
          >

            {/* SKU (READ ONLY) */}
            <div className={`text-xs ${t.textMuted}`}>
              {v.sku}
            </div>

            {/* NAME (READ ONLY) */}
            <div className={`text-sm ${t.text}`}>
              {v.name}
            </div>

            {/* PRICE EDITABLE */}
            <div>
              <input
                type="number"
                value={v.price}
                onChange={(e) =>
                  updateVariant(i, "price", Number(e.target.value))
                }
                className={`${t.input} w-full px-2 py-1 rounded text-sm`}
              />
            </div>

            {/* ACTIVE TOGGLE */}
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={v.active}
                onChange={(e) =>
                  updateVariant(i, "active", e.target.checked)
                }
              />
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}