// ProductForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Product, Variant } from "../../../domain/product";
import { createProduct, updateProduct, getVariants, createVariant, updateVariant } from "../../../application/productService";

export type ProductFormProps = {
  product: Product | null;
  variants: Variant[];
  onClose: () => void;
  onSave: (product: Product, variants: Variant[]) => Promise<void>;
};

export default function ProductForm({
  product,
  variants: initialVariants,
  onClose,
  onSave,
}: ProductFormProps) {

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [active, setActive] = useState(product?.active ?? true);
  const [variants, setVariants] = useState<Variant[]>(initialVariants || []);
  const [hasVariants, setHasVariants] = useState(initialVariants.length > 0);

  useEffect(() => {
    setVariants(initialVariants || []);
    setHasVariants(initialVariants.length > 0);
  }, [initialVariants]);

  const handleAddVariant = () => {
    setVariants([...variants, { sku: "", price: 0, active: true }]);
    setHasVariants(true);
  };

  const handleSave = async () => {
    const updatedProduct: Product = {
      ...product,
      name,
      description,
      active,
      id: product?.id ?? 0,
    };

    await onSave(updatedProduct, variants);
  };

  return (
    <div className="bg-white rounded-lg shadow px-4 py-4 space-y-4 w-fit">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {product ? "Editar producto" : "Nuevo producto"}
        </h2>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Activo
        </label>
      </div>

      {/* PRODUCT INFO */}
      <div className="grid grid-cols-2 gap-3">

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            Nombre
          </label>

          <input
            className="border rounded px-2 py-1.5 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasVariants}
              onChange={(e) => setHasVariants(e.target.checked)}
            />
            Tiene variantes
          </label>
        </div>

      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          Descripción
        </label>

        <textarea
          className="border rounded px-2 py-1.5 text-sm"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* VARIANTS */}
      {hasVariants && (

        <div className="border rounded p-3 bg-gray-50 space-y-3">

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Variantes
            </span>

            <button
              onClick={handleAddVariant}
              className="text-xs px-2 py-1 bg-purple-600 text-white rounded"
            >
              + Variante
            </button>
          </div>

          {variants.map((v, i) => (

            <div
              key={i}
              className="grid grid-cols-3 gap-2 items-center"
            >

              <input
                className="border rounded px-2 py-1 text-sm"
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => {
                  const newVariants = [...variants];
                  newVariants[i].sku = e.target.value;
                  setVariants(newVariants);
                }}
              />

              <input
                className="border rounded px-2 py-1 text-sm"
                type="number"
                placeholder="Precio"
                value={v.price}
                onChange={(e) => {
                  const newVariants = [...variants];
                  newVariants[i].price = parseFloat(e.target.value);
                  setVariants(newVariants);
                }}
              />

              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={v.active}
                  onChange={(e) => {
                    const newVariants = [...variants];
                    newVariants[i].active = e.target.checked;
                    setVariants(newVariants);
                  }}
                />
                Activa
              </label>

            </div>

          ))}

        </div>

      )}

      {/* ACTIONS */}

      <div className="flex justify-end gap-2 border-t pt-3">

        <button
          onClick={onClose}
          className="px-3 py-1.5 text-sm border rounded"
        >
          Cancelar
        </button>

        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded"
        >
          Guardar
        </button>

      </div>

    </div>
  );
}