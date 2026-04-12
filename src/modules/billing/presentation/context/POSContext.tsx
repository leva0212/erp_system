"use client"

import { createContext, useContext, useState } from "react"

export type SalesDocumentItem = {
  variant_id: number
  sku: string
  name: string
  quantity: number
  base_price: number
  price: number
  discount_amount: number
  subtotal: number
}

type POSContextType = {
  items: SalesDocumentItem[]
  selectedRow: number
  selectedCol: number
  setSelectedRow: (r: number) => void
  setSelectedCol: (c: number) => void

  updateCell: (row: number, changes: Partial<SalesDocumentItem>) => void
  setVariantToRow: (row: number, v: any, qty?: number) => void

  removeRow: (row: number) => void

  setAllQuantities: (qty: number) => void
  applyDiscountPercentRow: (row: number, percent: number) => void
  applyDiscountPercentAll: (percent: number) => void
}

const POSContext = createContext<POSContextType | null>(null)

function emptyRow(): SalesDocumentItem {
  return {
    variant_id: 0,
    sku: "",
    name: "",
    quantity: 1,
    base_price: 0,
    price: 0,
    discount_amount: 0,
    subtotal: 0,
  }
}

export function POSProvider({ children }: any) {
  const [items, setItems] = useState([emptyRow()])
  const [selectedRow, setSelectedRow] = useState(0)
  const [selectedCol, setSelectedCol] = useState(0)

  function ensureEmpty(list: SalesDocumentItem[]) {
    const last = list[list.length - 1]
    if (!last || last.variant_id !== 0) {
      return [...list, emptyRow()]
    }
    return list
  }

  function updateCell(row: number, changes: Partial<SalesDocumentItem>) {
    setItems(prev => {
      const updated = prev.map((i, idx) => {
        if (idx !== row) return i
        const n = { ...i, ...changes }
        n.subtotal = n.quantity * n.price
        return n
      })
      return ensureEmpty(updated)
    })
  }

  function setVariantToRow(row: number, v: any, qty = 1) {
    updateCell(row, {
      variant_id: v.id,
      sku: v.sku,
      name: v.name,
      base_price: v.price,
      price: v.price,
      quantity: qty,
      discount_amount: 0,
      subtotal: v.price * qty,
    })
    setSelectedRow(row + 1)
    setSelectedCol(0)
  }

  function removeRow(row: number) {
    setItems(prev => prev.filter((_, i) => i !== row))
  }

  function setAllQuantities(qty: number) {
    setItems(prev =>
      prev.map(i => ({
        ...i,
        quantity: qty,
        subtotal: qty * i.price,
      }))
    )
  }

  function applyDiscountPercentRow(row: number, percent: number) {
    setItems(prev =>
      prev.map((i, idx) =>
        idx === row
          ? { ...i, discount_amount: (i.price * percent) / 100 }
          : i
      )
    )
  }

  function applyDiscountPercentAll(percent: number) {
    setItems(prev =>
      prev.map(i => ({
        ...i,
        discount_amount: (i.price * percent) / 100,
      }))
    )
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
  )
}

export function usePOS() {
  const ctx = useContext(POSContext)
  if (!ctx) throw new Error("usePOS must be used inside provider")
  return ctx
}