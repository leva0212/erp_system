export interface SalesDocumentPayment {
  id?: number
  document_id: number

  amount: number
  method: "cash" | "card" | "transfer"

  created_at?: string
}