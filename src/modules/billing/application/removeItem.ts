import { SalesDocumentItem } from "../domain/salesDocumentItem"

export function removeItem(
  items: SalesDocumentItem[],
  id: number
) {
  return items.filter(i => i.variant_id !== id)
}