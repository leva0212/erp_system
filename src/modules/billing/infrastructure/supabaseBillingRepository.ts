import { supabase } from "@/modules/shared/lib/supabaseClient"

export const supabaseBillingRepository = {
  async createDocument(doc: any) {
    const { data, error } = await supabase
      .from("sales_documents")
      .insert(doc)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async insertItems(items: any[]) {
    const { error } = await supabase
      .from("sales_document_items")
      .insert(items)

    if (error) throw error
  },
}