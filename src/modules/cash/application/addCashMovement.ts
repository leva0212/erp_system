import { supabase } from "@/modules/shared/lib/supabaseClient"

type CashMovementInput = {
  cash_session_id: number
  amount: number
  type: "IN" | "OUT"
  reference?: string
}

export async function addCashMovement(input: CashMovementInput) {
  // 🔥 OPCIÓN SIMPLE (por ahora)
  console.log("Cash movement:", input)

  // 👉 OPCIÓN PRO (si creas tabla cash_movements)
  /*
  const { error } = await supabase
    .from("cash_movements")
    .insert({
      ...input,
      created_at: new Date(),
    })

  if (error) throw error
  */
}