// src/ui/components/dialogs/ManageAttributesDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Variant } from "../../../domain/product";
import { Attribute, AttributeValue } from "../../../domain/attribute";
import {
  getAttributes,
  getAttributeValues,
} from "../../../application/attributeService";

export type ManageAttributesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  variants: Variant[];
  variantAttributesMap: { [variantId: number]: number[] };
  setVariantAttributesMap: React.Dispatch<
    React.SetStateAction<{ [variantId: number]: number[] }>
  >;
};

export default function ManageAttributesDialog({
  isOpen,
  onClose,
  variants,
  variantAttributesMap,
  setVariantAttributesMap,
}: ManageAttributesDialogProps) {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeValuesMap, setAttributeValuesMap] = useState<{
    [attributeId: number]: AttributeValue[];
  }>({});

  useEffect(() => {
    if (!isOpen) return;
    loadAttributes();
  }, [isOpen]);

  const loadAttributes = async () => {
    try {
      const attrs = await getAttributes();
      setAttributes(attrs);

      // Cargar valores para cada atributo
      const map: { [key: number]: AttributeValue[] } = {};
      for (const attr of attrs) {
        const values = await getAttributeValues(attr.id);
        map[attr.id] = values;
      }
      setAttributeValuesMap(map);
    } catch (err) {
      console.error("Error loading attributes:", err);
    }
  };

  const handleSelectValue = (
    variantId: number,
    valueId: number,
    checked: boolean
  ) => {
    setVariantAttributesMap((prev) => {
      const current = prev[variantId] || [];
      let updated: number[];
      if (checked) {
        updated = [...current, valueId];
      } else {
        updated = current.filter((id) => id !== valueId);
      }
      return { ...prev, [variantId]: updated };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Gestionar atributos</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            Cerrar
          </button>
        </div>

        {variants.map((variant) => (
          <div key={variant.id} className="border-b mb-4 pb-2">
            <h3 className="font-medium mb-2">{variant.sku}</h3>

            {attributes.map((attr) => (
              <div key={attr.id} className="mb-2">
                <span className="text-sm font-semibold">{attr.name}:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(attributeValuesMap[attr.id] || []).map((val) => {
                    const checked =
                      (variantAttributesMap[variant.id] || []).includes(val.id);
                    return (
                      <label
                        key={val.id}
                        className="flex items-center gap-1 text-xs border rounded px-2 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            handleSelectValue(variant.id, val.id, e.target.checked)
                          }
                        />
                        {val.value}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border rounded text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}