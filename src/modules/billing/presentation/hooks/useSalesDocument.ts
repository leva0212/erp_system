
import { useState } from "react"
import { SalesDocumentItem } from "../../domain/salesDocumentItem"
import { addItem } from "../../application/addItem"
import { updateItem } from "../../application/updateItem"
import { removeItem } from "../../application/removeItem"
import { calculateTotals } from "../../application/calculateTotals"

export function useSalesDocument() {
  const [items, setItems] = useState<SalesDocumentItem[]>([])

  function handleAdd(item: SalesDocumentItem) {
    setItems(prev => addItem(prev, item))
  }

  function handleUpdate(
    id: number,
    changes: Partial<SalesDocumentItem>
  ) {
    setItems(prev => updateItem(prev, id, changes))
  }

  function handleRemove(id: number) {
    setItems(prev => removeItem(prev, id))
  }

  const totals = calculateTotals(items)

  return {
    items,
    totals,
    handleAdd,
    handleUpdate,
    handleRemove,
  }
}