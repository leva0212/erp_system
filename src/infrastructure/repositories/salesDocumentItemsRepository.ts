import { supabase } from "../supabaseClient"

export async function saveSalesDocumentItemsRepository(
  documentId: number,
  items: any[]
) {
  const rows = items.map((item) => ({
    document_id: documentId,
    variant_id: item.variant_id,
    sku: item.sku,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    discount_percent: item.discount_percent ?? 0,
    subtotal: item.subtotal,
  }))

  const { data, error } = await supabase
    .from("sales_document_items")
    .insert(rows)
    .select()

  if (error) throw error

  return data
}