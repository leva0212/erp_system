import { SalesDocumentItem } from "../domain/salesDocumentItem"

export function addItem(
  items: SalesDocumentItem[],
  newItem: SalesDocumentItem
) {
  const existing = items.find(i => i.variant_id === newItem.variant_id)

  if (existing) {
    const updated = {
      ...existing,
      quantity: existing.quantity + 1,
    }

    updated.subtotal =
      updated.quantity * updated.price - updated.discount_amount

    return items.map(i =>
      i.variant_id === updated.variant_id ? updated : i
    )
  }

  return [
    ...items,
    {
      ...newItem,
      quantity: 1,
      discount_percent: 0,
      discount_amount: 0,
      subtotal: newItem.price,
    },
  ]
}