import { supabase } from "@/modules/shared/lib/supabaseClient"

export async function getSalesDocument(id: number) {
  const { data, error } = await supabase
    .from("sales_documents")
    .select(`
      *,
      sales_document_items (*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error

  return data
}