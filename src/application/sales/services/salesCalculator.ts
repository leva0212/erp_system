import { SalesDocumentItem } from "@/src/domain/sales/SalesDocumentItem"

function money(v: number) {
  return Number((v || 0).toFixed(2))
}

export function calculateTotals(items: SalesDocumentItem[]) {
  const subtotal = items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  )

  const discount_total = items.reduce(
    (s, i) =>
      s +
      (i.price * i.quantity -
        (i.subtotal ?? i.price * i.quantity)),
    0
  )

  const total = items.reduce(
    (s, i) => s + i.subtotal,
    0
  )

  return {
    subtotal: money(subtotal),
    discount_total: money(discount_total),
    total: money(total),
  }
}