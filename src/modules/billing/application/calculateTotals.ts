import { SalesDocumentItem } from "../domain/salesDocumentItem"

export function calculateTotals(items: SalesDocumentItem[]) {
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0)

  const discount_total = items.reduce(
    (acc, i) => acc + i.discount_amount,
    0
  )

  const tax_total = 0 // puedes integrar luego

  const total = subtotal - discount_total + tax_total

  return {
    subtotal,
    discount_total,
    tax_total,
    total,
  }
}