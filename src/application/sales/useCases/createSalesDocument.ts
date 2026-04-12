import { createSalesDocumentRepo } from "@/infrastructure/repositories/salesDocumentRepository"
import { calculateTotals } from "../services/salesCalculator"
 

export async function createSalesDocument(input: {
  customer_id?: number
  type: "invoice" | "proforma" | "layaway"
  items: any[]
}) {
  const totals = calculateTotals(input.items)

  return await createSalesDocumentRepo({
    customer_id: input.customer_id,
    type: input.type,
    status: "draft",
    subtotal: totals.subtotal,
    discount_total: totals.discount_total,
    total: totals.total,
    paid_total: 0,
  })
}