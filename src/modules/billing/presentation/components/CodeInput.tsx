"use client";

import { useEffect, useState } from "react";
import { usePOS } from "../context/POSContext";
import { useThemeClasses } from "@/theme/useThemeClasses";
import { getVariants } from "@/modules/products/application/getVariants";
import { codeInputRef } from "../context/codeInputRef";
import AlertDialog from "@/modules/shared/presentation/components/AlertDialog";
export default function CodeInput({ openSearch }: any) {
  useEffect(() => {
    setTimeout(() => {
      codeInputRef.current?.focus();
    }, 0);
  }, []);

  const [value, setValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

const [dialogConfig, setDialogConfig] = useState({
  title: "",
  message: "",
  variant: "warning" as "success" | "warning" | "error" | "confirm",
  onConfirm: undefined as (() => void) | undefined,
});
  const t = useThemeClasses();

  const {
    items,
    selectedRow,
    setVariantToRow,
    removeRow,
    updateCell,
    setAllQuantities,
    setSelectedRow,
  } = usePOS();

  // ========================
  // 🔥 HELPERS
  // ========================

function setError(message: string) {
  showDialog(
    "error",
    "Error de Validación",
    message,
  );

  setTimeout(() => {
    const el = codeInputRef.current;
    if (!el) return;

    el.focus();
    el.select();
  }, 0);
}

  function showDialog(
  variant: "success" | "warning" | "error" | "confirm",
  title: string,
  message: string,
  onConfirm?: () => void,
) {
  setDialogConfig({
    title,
    message,
    variant,
    onConfirm,
  });

  setDialogOpen(true);
}

  function parseNumberSafe(value: string): number | null {
    const clean = value.replace(",", ".");

    if (!/^[-]?\d*\.?\d+$/.test(clean)) return null;

    const num = Number(clean);
    if (isNaN(num)) return null;

    return num;
  }

  function hasProducts() {
    return items.some((i) => i.variant_id !== 0);
  }

  async function findVariantSmart(code: string) {
    const list = await getVariants("");
    return list.find((v) =>
      /^\d+$/.test(code) ? v.id === Number(code) : v.sku === code,
    );
  }

  // ========================
  // 🔥 MAIN LOGIC
  // ========================

  async function handleCommand(input: string) {
    if (!input) return;

    const item = items[selectedRow];
    const base = item?.price * item?.quantity || 0;

    // ➕ BUSCAR
    if (input === "+") {
      openSearch();
      setValue("");
      return;
    }

    // ➖ ELIMINAR
    if (input === "-") {
      if (!item || item.variant_id === 0) {
        setValue("");
        return;
      }

      if (items.length === 1) {
        setValue("");
        return;
      }

      /*const ok = confirm("¿Eliminar esta línea?");
      if (!ok) return;

      removeRow(selectedRow);*/
      showDialog(
  "confirm",
  "Eliminar Línea",
  "¿Seguro que deseas eliminar esta línea?",
  () => {
    removeRow(selectedRow);

    setTimeout(() => {
      codeInputRef.current?.focus();
    }, 0);
  },
);

setValue("");
return;

      setValue("");
      setTimeout(() => codeInputRef.current?.focus(), 0);

      return;
    }

    // ❌ SIN PRODUCTOS
    if (!hasProducts()) {
      setValue("");
      return;
    }

    // 🔢 ** CANTIDAD GLOBAL
    if (input.startsWith("**")) {
      const raw = input.replace("**", "");
      const qty = parseNumberSafe(raw);

      if (qty === null) {
        setError("Cod. Inválido");
        return;
      }

      /*const ok = confirm(`¿Cambiar TODAS las cantidades a ${qty}?`);
      if (!ok) return;

      setAllQuantities(qty);
      setValue("");
      return;*/
      showDialog(
  "confirm",
  "Cambio Global",
  `¿Cambiar todas las cantidades a ${qty}?`,
  () => {
    setAllQuantities(qty);
  },
);

setValue("");
return;
    }

    // ========================
    // 🔥 %% DESCUENTO GLOBAL
    // ========================

    if (input.startsWith("%%")) {
      const raw = input.replace("%%", "");
      const valueNum = parseNumberSafe(raw);

      if (valueNum === null) {
        setError("Cod. Inválido");
        return;
      }

      const validItems = items.filter((i) => i.variant_id !== 0);

      const totalBase = validItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );

      if (totalBase === 0) {
        setValue("");
        return;
      }

      validItems.forEach((item, index) => {
        const base = item.price * item.quantity;

        let percent = 0;
        let amount = 0;

        if (valueNum <= 100) {
          percent = valueNum;
          amount = (base * percent) / 100;
        } else {
          const ratio = base / totalBase;
          amount = valueNum * ratio;
          percent = (amount / base) * 100;
        }

        updateCell(index, {
          discount_percent: percent,
          discount_amount: amount,
        });
      });

      setValue("");
      return;
    }

    // ========================
    // 🔥 % DESCUENTO LINEA
    // ========================

    if (input.startsWith("%")) {
      if (!item || item.variant_id === 0) {
        setValue("");
        return;
      }

      const raw = input.replace("%", "");
      const valueNum = parseNumberSafe(raw);

      if (valueNum === null) {
        setError("Cod. Inválido");
        return;
      }

      let percent = 0;
      let amount = 0;

      if (valueNum <= 100) {
        percent = valueNum;
        amount = (base * percent) / 100;
      } else {
        amount = Math.min(valueNum, base);
        percent = (amount / base) * 100;
      }

      updateCell(selectedRow, {
        discount_percent: percent,
        discount_amount: amount,
      });

      setValue("");
      return;
    }

    // ========================
    // 🔢 * CANTIDAD
    // ========================

    if (input.startsWith("*")) {
      const raw = input.replace("*", "");
      const qty = parseNumberSafe(raw);

      if (qty === null) {
        setError("Cod. Inválido");
        return;
      }

      updateCell(selectedRow, { quantity: qty });
      setValue("");
      return;
    }

    // ========================
    // 📦 PRODUCTO
    // ========================

    let code = input;
    let qty = 1;

    if (input.includes("*")) {
      const [c, q] = input.split("*");

      const parsedQty = parseNumberSafe(q);

      if (parsedQty === null) {
        setError("Cod. Inválido");
        return;
      }

      code = c;
      qty = parsedQty;
    }

    const v = await findVariantSmart(code);

    if (!v) {
      setError("Cod. Inválido");
      return;
    }

    setVariantToRow(selectedRow, v, qty);

    setValue("");
  }

  return (
    <>
    <AlertDialog
  open={dialogOpen}
  title={dialogConfig.title}
  message={dialogConfig.message}
  variant={dialogConfig.variant}
  onClose={() => setDialogOpen(false)}
  onConfirm={dialogConfig.onConfirm}
/>
   
    <input
      ref={(el) => {
        codeInputRef.current = el;
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (["+", "-"].includes(e.key)) {
          e.preventDefault();
          handleCommand(e.key);
          return;
        }

        if (e.key === "Enter") {
          e.preventDefault();
          handleCommand(value);
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedRow((prev) =>
            Math.min(prev + 1, items.length - 1),
          );
          return;
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedRow((prev) => Math.max(prev - 1, 0));
          return;
        }
      }}
      className={`max-w-[150px] !px-1 !py-1 mb-2 border ${t.input}`}
    />
    </>
  );
}