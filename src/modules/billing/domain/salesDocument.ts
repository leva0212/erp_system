export type SalesDocument = {
  id?: number
  customer_id?: number

  type: "invoice" | "proforma" | "layaway"
  status: "draft" | "active" | "partial" | "paid" | "cancelled"

  subtotal: number
  discount_total: number
  tax_total: number
  transport_cost: number
  total: number

  paid_total: number
  balance?: number

  created_at?: string
}