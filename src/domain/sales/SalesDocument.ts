export type SalesDocumentType =
  | "invoice"
  | "proforma"
  | "layaway"

export type SalesDocumentStatus =
  | "draft"
  | "active"
  | "partial"
  | "paid"
  | "cancelled"

export interface SalesDocument {
  id: number
  number: number
  customer_id?: number
  type: SalesDocumentType
  status: SalesDocumentStatus

  subtotal: number
  discount_total: number
  transport_cost: number
  tax: number
  total: number
  paid_total: number

  created_at: string
}