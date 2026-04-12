import { SalesDocumentItem } from "../domain/salesDocumentItem"

export function applyDiscount(
  items: SalesDocumentItem[],
  percent: number
) {
  return items.map(item => {
    const discount_amount =
      (item.price * item.quantity * percent) / 100

    return {
      ...item,
      discount_percent: percent,
      discount_amount,
      subtotal: item.price * item.quantity - discount_amount,
    }
  })
}