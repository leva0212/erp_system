"use client";

import { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
} from "../../../application/productService";

import { saveVariantsUseCase } from "@/application/variants/saveVariantsUseCase";
import { validateVariantExplosion } from "@/application/variants/variantExplosionService";
import { generateVariantsUseCase } from "@/application/variants/generateVariantsUseCase";

import VariantGridEditor from "../variants/VariantGridEditor";
//import AttributeSelector from "../variants/AttributeSelector";

import { useThemeClasses } from "@/theme/useThemeClasses";
import { getAttributesWithValues } from "@/application/attributeService";

export default function ProductWizard({ product, onClose }: any) {
  const t = useThemeClasses();

  // =========================
  // STEP CONTROL
  // =========================
  const [step, setStep] = useState(1);

  // =========================
  // PRODUCT STATE
  // =========================
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [active, setActive] = useState(true);

  // =========================
  // ATTRIBUTES (REAL DB)
  // =========================
  const [attributes, setAttributes] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>({});
    const [error, setError] = useState<string | null>(null);
    const [validationResult, setValidationResult] = useState<any>(null);
  

  // =========================
  // VARIANTS
  // =========================
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD ATTRIBUTES FROM DB
  // =========================
useEffect(() => {
  const load = async () => {
    const data = await getAttributesWithValues();
    setAttributes(data);
  };

  load();
}, []);

useEffect(() => {
  if (step !== 3) return;

  const runValidation = async () => {
    setError(null);
    setValidationResult(null);

    try {
      const attrs = buildAttributes();

      if (attrs.length === 0) {
        setError("Debes seleccionar al menos un atributo.");
        return;
      }

      const explosion = validateVariantExplosion(attrs);

      const result = generateVariantsUseCase({
        productName: name,
        attributes: attrs,
      });

      if (!result.length) {
        setError("No se pudieron generar variantes.");
        return;
      }

      setVariants(result);

      setValidationResult({
        total: result.length,
        warning: explosion.warning,
      });

    } catch (err) {
      console.error(err);
      setError("Error validando combinaciones.");
    }
  };

  runValidation();
}, [step]);

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
  // EXPLOSION CHECK
  // =========================
  const checkExplosion = () => {
    const result = validateVariantExplosion(buildAttributes());

    if (result.warning) {
      alert(
        `⚠️ ${result.total} variantes generadas. Puede afectar rendimiento.`
      );
    }

    return result;
  };

  // =========================
  // GENERATE VARIANTS
  // =========================
  const generate = () => {
    checkExplosion();

    const result = generateVariantsUseCase({
      productName: name,
      attributes: buildAttributes(),
    });

    setVariants(result);
    setStep(4);
  };

  // =========================
  // SAVE FINAL
  // =========================
  const save = async () => {
    setLoading(true);

    try {
      let savedProduct;

      if (product?.id) {
        savedProduct = await updateProduct(product.id, {
          name,
          description,
          active,
        });
      } else {
        savedProduct = await createProduct({
          name,
          description,
          active,
        });
      }

      await saveVariantsUseCase(savedProduct.id, variants);

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

      <div className={`${t.surface} w-[95%] max-w-6xl rounded-xl shadow-xl overflow-hidden`}>

        {/* HEADER */}
        <div className={`border-b ${t.border} px-5 py-4 flex justify-between items-center`}>
          <h2 className={t.text + " font-semibold"}>
            Product Wizard ERP
          </h2>

          <button
            onClick={onClose}
            className={t.textMuted + " hover:text-gray-900"}
          >
            ✕
          </button>
        </div>

        {/* STEPS */}
        <div className={`flex gap-2 px-5 py-3 text-xs border-b ${t.border}`}>
           {["Producto", "Atributos", "Validando", "Variantes", "Guardar"].map(
            (label, i) => {
              const s = i + 1;

              return (
                <div
                  key={s}
                  className={`px-3 py-1 rounded ${
                    step === s
                      ? t.buttonPrimary
                      : t.surface + " " + t.text + " " + t.border
                  }`}
                >
                  {label}
                </div>
              );
            }
          )}
        </div>

        {/* BODY */}
        <div className={`p-5 ${t.text}`}>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-3">

              <input
                className={t.input + " w-full p-2 rounded"}
                placeholder="Nombre producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className={t.input + " w-full p-2 rounded"}
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Activo
              </label>

              <button
                onClick={() => setStep(2)}
                className={t.buttonPrimary + " px-4 py-2"}
              >
                Siguiente
              </button>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">

            
*/
              <button
                onClick={() => setStep(3)}
                className={t.buttonPrimary + " px-4 py-2"}
              >
                Generar variantes
              </button>

            </div>
          )}

  {step === 3 && (
  <div className="space-y-4">

    {!validationResult && !error && (
      <div className="flex flex-col items-center gap-3 py-6">

        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>

        <p className={t.textMuted + " text-sm"}>
          Validando combinaciones de variantes...
        </p>

      </div>
    )}

    {validationResult && (
      <div className="space-y-3">

        <div className="bg-green-100 text-green-700 p-3 rounded text-sm">
          ✔ Se generarán {validationResult.total} variantes
        </div>

        {validationResult.warning && (
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded text-sm">
            ⚠ Muchas variantes pueden afectar rendimiento
          </div>
        )}

        <div className="flex justify-between">

          <button
            onClick={() => setStep(2)}
            className={t.textMuted}
          >
            ← Volver
          </button>

          <button
            onClick={() => setStep(4)}
            className={t.buttonPrimary + " px-4 py-2"}
          >
            Continuar
          </button>

        </div>

      </div>
    )}

    {error && (
      <div className="space-y-3">

        <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
          ⚠ {error}
        </div>

        <button
          onClick={() => setStep(2)}
          className={t.buttonPrimary + " px-4 py-2"}
        >
          Volver
        </button>

      </div>
    )}

  </div>
)}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">

              <VariantGridEditor
                variants={variants}
                setVariants={setVariants}
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className={t.textMuted}
                >
                  ← Volver
                </button>

                <button
                  onClick={() => setStep(5)}
                  className={t.buttonPrimary + " px-4 py-2"}
                >
                  Continuar
                </button>
              </div>

            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-4">

              <p className={t.textMuted + " text-sm"}>
                Revisión final antes de guardar
              </p>

              <button
                onClick={save}
                disabled={loading}
                className={t.buttonPrimary + " px-4 py-2"}
              >
                {loading ? "Guardando..." : "Guardar Todo"}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}