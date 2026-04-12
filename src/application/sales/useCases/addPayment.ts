import { createPayment, getTotalPaid } from "@/infrastructure/repositories/paymentRepository"
import { getSalesDocumentById } from "@/infrastructure/repositories/salesDocumentRepository"
 
import { supabase } from "@/infrastructure/supabaseClient"
import { updateStatus } from "../services/salesStateEngine";

export async function addPayment(input: {
  document_id: number
  amount: number
  method: string
}) {
  await createPayment(input)

  const paid = await getTotalPaid(input.document_id)
  const doc = await getSalesDocumentById(input.document_id)

  const status = updateStatus(doc.total, paid)

  await supabase
    .from("sales_documents")
    .update({
      paid_total: paid,
      status,
    })
    .eq("id", input.document_id)

  return { paid, status }
}