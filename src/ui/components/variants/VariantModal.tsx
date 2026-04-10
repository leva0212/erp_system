"use client";

import { useMemo, useState } from "react";
import VariantPreviewTable from "./VariantPreviewTable";

import { generateVariantsUseCase } from "@/src/application/variants/generateVariantsUseCase";
import { saveVariantsUseCase } from "@/src/application/variants/saveVariantsUseCase";
import { validateVariantExplosion } from "@/src/application/variants/variantExplosionService";
export default function VariantModal({
  product,
  attributes,
  onClose,
}: any) {

  const [tab, setTab] = useState<"builder" | "preview">("builder");
  const [selected, setSelected] = useState<any>({});
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<any>(null);

  // =========================
  // BUILD ATTRIBUTES
  // =========================
  const buildAttributes = () => {
    return Object.entries(selected).map(([attrId, values]: any) => ({
      attributeId: Number(attrId),
      values,
    }));
  };

  // =========================
  // LIVE COUNT (SHOPIFY STYLE)
  // =========================
  const variantCount = useMemo(() => {
    const result = validateVariantExplosion(buildAttributes());
    return result.total;
  }, [selected]);

  // =========================
  // TOGGLE VALUE
  // =========================
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

  // =========================
  // GENERATE
  // =========================
  const generate = () => {
    const result = validateVariantExplosion(buildAttributes());

    setWarning(result.warning ? result : null);

    const variants = generateVariantsUseCase({
      productName: product.name,
      attributes: buildAttributes(),
    });

    setVariants(variants);
    setTab("preview");
  };

  // =========================
  // SAVE
  // =========================
  const save = async () => {
    setLoading(true);

    try {
      await saveVariantsUseCase(product.id, variants);
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      {/* OVERLAY LOADING */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg">
          Guardando variantes...
        </div>
      )}

      <div className="bg-white w-[95%] max-w-6xl rounded-xl shadow-xl overflow-hidden">

        {/* HEADER (SHOPIFY STYLE) */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex justify-between items-center">

          <div>
            <h2 className="text-lg font-semibold">
              Variantes - {product.name}
            </h2>

            <p className="text-xs text-gray-500">
              {variantCount} combinaciones posibles
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* WARNING BAR */}
        {warning && (
          <div className="bg-yellow-100 text-yellow-800 px-5 py-2 text-sm">
            ⚠️ Estás generando {warning.total} variantes. Puede afectar rendimiento.
          </div>
        )}

        {/* TABS */}
        <div className="flex border-b px-5 gap-4 text-sm">
          <button
            onClick={() => setTab("builder")}
            className={`py-3 border-b-2 ${
              tab === "builder"
                ? "border-black font-semibold"
                : "border-transparent text-gray-500"
            }`}
          >
            Builder
          </button>

          <button
            onClick={() => setTab("preview")}
            className={`py-3 border-b-2 ${
              tab === "preview"
                ? "border-black font-semibold"
                : "border-transparent text-gray-500"
            }`}
          >
            Preview
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">

          {/* BUILDER */}
          {tab === "builder" && (
            <div className="space-y-4">

              {attributes.map((attr: any) => (
                <div
                  key={attr.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <h3 className="font-medium mb-2">{attr.name}</h3>

                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val: any) => (
                      <button
                        key={val.id}
                        onClick={() => toggleValue(attr.id, val)}
                        className={`px-3 py-1 rounded-full text-sm border transition ${
                          selected[attr.id]?.find((v: any) => v.id === val.id)
                            ? "bg-black text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {val.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button
                  onClick={generate}
                  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                >
                  Generar variantes
                </button>
              </div>

            </div>
          )}

          {/* PREVIEW */}
          {tab === "preview" && (
            <div className="space-y-4">

              <VariantPreviewTable
                variants={variants}
                setVariants={setVariants}
              />

              <div className="flex justify-between pt-4">

                <button
                  onClick={() => setTab("builder")}
                  className="text-gray-600"
                >
                  ← Volver
                </button>

                <button
                  onClick={save}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                >
                  Guardar variantes
                </button>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}