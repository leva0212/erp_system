"use client";

import { useState, useEffect } from "react";
import { Product, Variant } from "../../../domain/product";
import { Attribute } from "../../../domain/attribute";
import {
  createProduct,
  updateProduct,
  createVariant,
  updateVariant,
  setVariantAttributeValues,
} from "../../../application/productService";
import ManageAttributesDialog from "../dialogs/ManageAttributesDialog";

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

  // Estado de atributos por variante
  const [variantAttributesMap, setVariantAttributesMap] = useState<{
    [variantId: number]: number[]; // array de attribute_value_id
  }>({});

  const [isAttributesDialogOpen, setIsAttributesDialogOpen] = useState(false);

  useEffect(() => {
    setVariants(initialVariants || []);
    setHasVariants(initialVariants.length > 0);
  }, [initialVariants]);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { sku: "", price: 0, active: true, id: Date.now() }, // temporal ID para UI
    ]);
    setHasVariants(true);
  };

  const handleSave = async () => {
    // 1️⃣ Guardar producto
    let savedProduct: Product;
    if (product?.id) {
      savedProduct = await updateProduct(product.id, { name, description, active });
    } else {
      savedProduct = await createProduct({ name, description, active });
    }

    // 2️⃣ Guardar variantes
    const savedVariants: Variant[] = [];
    for (const v of variants) {
      let saved: Variant;
      if (v.id && typeof v.id === "number") {
        saved = await updateVariant(v.id, { sku: v.sku, price: v.price, active: v.active });
      } else {
        saved = await createVariant({
          product_id: savedProduct.id,
          sku: v.sku,
          price: v.price,
          active: v.active,
        });
      }

      // 3️⃣ Guardar relación variante-atributos
      const attributeValueIds = variantAttributesMap[v.id as number] || [];
      if (attributeValueIds.length) {
        await setVariantAttributeValues(saved.id, attributeValueIds);
      }

      savedVariants.push(saved);
    }

    await onSave(savedProduct, savedVariants);
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
          <label className="text-xs text-gray-500 mb-1">Nombre</label>
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
        <label className="text-xs text-gray-500 mb-1">Descripción</label>
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
            <span className="text-sm font-medium">Variantes</span>
            <div className="flex gap-2">
              <button
                onClick={handleAddVariant}
                className="text-xs px-2 py-1 bg-purple-600 text-white rounded"
              >
                + Variante
              </button>
              <button
                onClick={() => setIsAttributesDialogOpen(true)}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
              >
                Gestionar atributos
              </button>
            </div>
          </div>

          {variants.map((v, i) => (
            <div key={v.id} className="grid grid-cols-3 gap-2 items-center">
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

      {/* DIALOGO ATRIBUTOS */}
      <ManageAttributesDialog
        isOpen={isAttributesDialogOpen}
        onClose={() => setIsAttributesDialogOpen(false)}
        variants={variants}
        variantAttributesMap={variantAttributesMap}
        setVariantAttributesMap={setVariantAttributesMap}
      />

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 border-t pt-3">
        <button onClick={onClose} className="px-3 py-1.5 text-sm border rounded">
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