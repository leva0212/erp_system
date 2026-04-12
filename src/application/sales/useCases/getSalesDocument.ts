import { supabase } from "@/infrastructure/supabaseClient"

export async function getSalesDocument(document_id: number) {
  const { data: document } = await supabase
    .from("sales_documents")
    .select("*")
    .eq("id", document_id)
    .single()

  const { data: items } = await supabase
    .from("sales_document_items")
    .select("*")
    .eq("document_id", document_id)

  const { data: payments } = await supabase
    .from("invoice_payments")
    .select("*")
    .eq("invoice_id", document_id)

  return {
    document,
    items: items || [],
    payments: payments || [],
  }
}