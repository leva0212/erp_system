import { SalesDocumentItem } from "@/domain/sales/SalesDocumentItem"

import { supabase } from "@/infrastructure/supabaseClient"
import { calculateTotals } from "../services/salesCalculator"

export async function addSalesItem(input: {
  document_id: number
  variant: {
    id: number
    sku: string
    name: string
    price: number
  }
}) {
  const { data: currentItems } = await supabase
    .from("sales_document_items")
    .select("*")
    .eq("document_id", input.document_id)

  const items: SalesDocumentItem[] = currentItems || []

  const existing = items.find(
    (i) => i.variant_id === input.variant.id
  )

  if (existing) {
    existing.quantity += 1

    existing.subtotal =
      existing.price * existing.quantity
  } else {
    /*items.push({
      document_id: input.document_id,
      variant_id: input.variant.id,
      sku: input.variant.sku,
      name: input.variant.name,
      price: input.variant.price,
      quantity: 1,
      discount_percent: 0,
      subtotal: input.variant.price,
    })*/
  }

  const totals = calculateTotals(items)

  await supabase
    .from("sales_documents")
    .update({
      subtotal: totals.subtotal,
      discount_total: totals.discount_total,
      total: totals.total,
    })
    .eq("id", input.document_id)

  return items
}