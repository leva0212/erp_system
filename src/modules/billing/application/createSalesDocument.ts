import { supabaseBillingRepository } from "../infrastructure/supabaseBillingRepository"
import { SalesDocumentItem } from "../domain/salesDocumentItem"
import { calculateTotals } from "./calculateTotals"

export async function createSalesDocument(
  customer_id: number,
  items: SalesDocumentItem[]
) {
  if (!items.length) {
    throw new Error("No puedes crear un documento sin items")
  }

  const totals = calculateTotals(items)

  const doc = {
    customer_id,
    type: "invoice",
    status: "active",
    ...totals,
    paid_total: 0,
  }

  const created = await supabaseBillingRepository.createDocument(doc)

  const itemsToInsert = items.map(i => ({
    sales_document_id: created.id,
    variant_id: i.variant_id,
    sku: i.sku,
    name: i.name,
    quantity: i.quantity,
    price: i.price,
    discount_percent: i.discount_percent,
    discount_amount: i.discount_amount,
    subtotal: i.subtotal,
  }))

  await supabaseBillingRepository.insertItems(itemsToInsert)

  return created
}