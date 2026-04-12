import { supabase } from "../supabaseClient"

// =========================
// CREATE PAYMENT
// =========================
export async function createPayment(data: {
  document_id: number
  amount: number
  method: string
}) {
  const { data: payment, error } = await supabase
    .from("invoice_payments")
    .insert([
      {
        invoice_id: data.document_id,
        amount: data.amount,
        method: data.method,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return payment
}

// =========================
// GET TOTAL PAID (ESTO TE FALTABA)
// =========================
export async function getTotalPaid(invoiceId: number) {
  const { data, error } = await supabase
    .from("invoice_payments")
    .select("amount")
    .eq("invoice_id", invoiceId)

  if (error) throw error

  return (data || []).reduce((sum, p) => sum + p.amount, 0)
}