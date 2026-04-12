import { supabase } from "@/modules/shared/lib/supabaseClient"

export async function moveInventory(movement: any) {
  const { error } = await supabase
    .from("inventory_movements")
    .insert({
      ...movement,
      created_at: new Date(),
    })

  if (error) throw error
}