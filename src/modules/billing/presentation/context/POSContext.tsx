"use client";

import { createContext, useContext, useState } from "react";
import { SalesDocumentItem } from "../../domain/salesDocumentItem";

type POSContextType = {
  items: SalesDocumentItem[];
  selectedRow: number;
  selectedCol: number;

  // 🔥 CAMBIAR ESTO
  setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
  setSelectedCol: React.Dispatch<React.SetStateAction<number>>;

  updateCell: (row: number, changes: Partial<SalesDocumentItem>) => void;
  setVariantToRow: (row: number, v: any, qty?: number) => void;

  removeRow: (row: number) => void;

  setAllQuantities: (qty: number) => void;
  applyDiscountPercentRow: (row: number, percent: number) => void;
  applyDiscountPercentAll: (percent: number) => void;
};

const POSContext = createContext<POSContextType | null>(null);

function emptyRow(): SalesDocumentItem {
  return {
    variant_id: 0,
    sku: "",
    name: "",
    quantity: 1,

    price: 0,
    base_subtotal: 0,

    discount_percent: 0,
    discount_amount: 0,

    tax_percent: 13,
    tax_amount: 0,

    subtotal: 0,
    cost: 0,

    // 🔥 NUEVO
    max_discount_percent: 100,
    allow_discount: true,
  };
}

/*
function recalc(item: SalesDocumentItem): SalesDocumentItem {
  const base = item.price * item.quantity

  // 🔥 descuento
  let discount_amount = item.discount_amount
  let discount_percent = item.discount_percent

  // recalcular si cambia precio
  if (discount_percent > 0) {
    discount_amount = (base * discount_percent) / 100
  } else if (discount_amount > 0) {
    discount_percent = (discount_amount / base) * 100
  }

  // 🔥 subtotal después descuento
  const subtotal = base - discount_amount

  // 🔥 impuestos
  const tax_amount = (subtotal * item.tax_percent) / 100

  return {
    ...item,
    base_subtotal: base,//precio * cantidad sin descuento
    discount_amount,
    discount_percent,
    subtotal,
    tax_amount,
  }
}*/
function calculateLine(i: SalesDocumentItem): SalesDocumentItem {
  const base = i.price * i.quantity;

  let discount_amount = i.discount_amount;
  let discount_percent = i.discount_percent;

  if (discount_percent > 0) {
    discount_amount = (base * discount_percent) / 100;
  }

  if (discount_amount > 0 && discount_percent === 0) {
    discount_percent = (discount_amount / base) * 100;
  }

  const taxable = base - discount_amount;

  const tax_amount = i.tax_percent > 0 ? (taxable * i.tax_percent) / 100 : 0;

  const subtotal = taxable + tax_amount;

  return {
    ...i,
    base_subtotal: base,
    discount_amount,
    discount_percent,
    tax_amount,
    subtotal,
  };
}

export function POSProvider({ children }: any) {
  {
    /* const [items, setItems] = useState([emptyRow()]) */
  }

  const [items, setItems] = useState<SalesDocumentItem[]>([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);

  function ensureEmpty(list: SalesDocumentItem[]) {
    const last = list[list.length - 1];
    if (!last || last.variant_id !== 0) {
      return [...list, emptyRow()];
    }
    return list;
  }

  function updateCell(row: number, changes: Partial<SalesDocumentItem>) {
    setItems((prev) => {
      const updated = prev.map((i, idx) => {
        if (idx !== row) return i;

        const merged = { ...i, ...changes };

        // 🔥 recalcular TODO
        return calculateLine(merged);
        //return recalc(merged)
      });
      {
        /* return ensureEmpty(updated) */
      }
      return updated;
    });
  }

  function setVariantToRow(row: number, v: any, qty = 1) {
    setItems((prev) => {
      const updated = [...prev];

      // 🔥 si no existe la fila, la crea
      if (!updated[row]) {
        updated.push(emptyRow());
      }

      updated[row] = {
        variant_id: v.id,
        sku: v.sku,
        name: v.name,
        allow_discount: v.allow_discount ?? true,
        max_discount_percent: v.max_discount_percent ?? 100,
        tax_percent: v.tax_type === "exempt" ? 0 : v.tax_percent,
        cost: v.cost ?? 0,
        base_subtotal: v.price * qty,
        discount_percent: 0,
        discount_amount: 0,
        tax_amount:
          (v.price * qty * (v.tax_type === "exempt" ? 0 : v.tax_percent)) / 100,
        subtotal: v.price * qty,

        /*  base_price: v.price,*/
        price: v.price,
        quantity: qty,
        /**discount_amount: 0,
      subtotal: v.price * qty,*/
      };

      return updated;
    });

    setSelectedRow(row + 1);
    setSelectedCol(1);
  }

  {
    /*
 function setVariantToRow(row: number, v: any, qty = 1) {
  updateCell(row, {
    variant_id: v.id,
    sku: v.sku,
    name: v.name,
    price: v.price,
    quantity: qty,

    tax_percent: v.tax_type === "exempt" ? 0 : v.tax_percent,

    discount_percent: 0,
    discount_amount: 0,

    max_discount_percent: v.max_discount_percent ?? 100,
    allow_discount: v.allow_discount ?? true,

    // 🔥 CLAVE
    cost: v.cost ?? 0,
  })

  setSelectedRow(row + 1)
  setSelectedCol(0)
}*/
  }

  function removeRow(row: number) {
    setItems((prev) => prev.filter((_, i) => i !== row));
  }

  function setAllQuantities(qty: number) {
    setItems((prev) => prev.map((i) => calculateLine({ ...i, quantity: qty })));
  }

  function applyDiscountPercentRow(row: number, percent: number) {
    updateCell(row, {
      discount_percent: percent,
      discount_amount: 0,
    });
  }

  function applyDiscountPercentAll(percent: number) {
    setItems((prev) =>
      prev.map((i) =>
        calculateLine({
          ...i,
          discount_percent: percent,
          discount_amount: 0,
        }),
      ),
    );
  }

  return (
    <POSContext.Provider
      value={{
        items,
        selectedRow,
        selectedCol,
        setSelectedRow,
        setSelectedCol,
        updateCell,
        setVariantToRow,
        removeRow,
        setAllQuantities,
        applyDiscountPercentRow,
        applyDiscountPercentAll,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error("usePOS must be used inside provider");
  return ctx;
}
