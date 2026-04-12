import { supabase } from "@/modules/shared/lib/supabaseClient"

export async function registerPayment(payment: any) {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single()

  if (error) throw error

  return data
}