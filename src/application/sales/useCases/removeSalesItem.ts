import { supabase } from "@/infrastructure/supabaseClient"
import { calculateTotals } from "../services/salesCalculator"
 

export async function removeSalesItem(input: {
  item_id: number
  document_id: number
}) {
  await supabase
    .from("sales_document_items")
    .delete()
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