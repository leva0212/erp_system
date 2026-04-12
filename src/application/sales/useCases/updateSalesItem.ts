import { supabase } from "@/src/infrastructure/supabaseClient"
import { calculateTotals } from "../services/salesCalculator"
 

export async function updateSalesItem(input: {
  item_id: number
  quantity?: number
  discount_percent?: number
  document_id: number
}) {
  const { data: item } = await supabase
    .from("sales_document_items")
    .select("*")
    .eq("id", input.item_id)
    .single()

  if (!item) throw new Error("Item not found")

  const quantity = input.quantity ?? item.quantity
  const discount = input.discount_percent ?? item.discount_percent

  const subtotalBefore = item.price * quantity
  const subtotal =
    subtotalBefore -
    subtotalBefore * (discount / 100)

  await supabase
    .from("sales_document_items")
    .update({
      quantity,
      discount_percent: discount,
      subtotal,
    })
    .eq("id", input.item_id)

  const { data: items } = await supabase
    .from("sales_document_items")
    .select("*")
    .eq("document_id", input.document_id)

  const totals = calculateTotals(items || [])

  await supabase
    .from("sales_documents")
    .update({
      subtotal: totals.subtotal,
      discount_total: totals.discount_total,
      total: totals.total,
    })
    .eq("id", input.document_id)

  return true
}