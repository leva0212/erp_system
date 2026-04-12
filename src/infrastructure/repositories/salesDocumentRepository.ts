import { supabase } from "../supabaseClient"

export async function createSalesDocumentRepo(input: any) {
  const { data, error } = await supabase
    .from("sales_documents")
    .insert([input])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getSalesDocumentById(id: number) {
  const { data, error } = await supabase
    .from("sales_documents")
    .select("id,total")
    .eq("id", id)
    .single()

  if (error || !data) throw new Error("Document not found")

  return data
}