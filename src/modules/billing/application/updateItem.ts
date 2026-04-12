import { SalesDocumentItem } from "../domain/salesDocumentItem"

export function updateItem(
  items: SalesDocumentItem[],
  id: number,
  changes: Partial<SalesDocumentItem>
) {
  return items.map(item => {
    if (item.variant_id !== id) return item

    const updated = { ...item, ...changes }

    const discount =
      updated.discount_amount ??
      (updated.price * updated.quantity * (updated.discount_percent / 100))

    updated.subtotal =
      updated.quantity * updated.price - discount

    return updated
  })
}