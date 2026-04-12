export interface SalesDocumentItem {
  id?: number
  sales_document_id?: number

  variant_id: number

  sku: string
  name: string

  quantity: number
  price: number

  // 🔥 ESTO FALTABA
  discount_percent: number
  discount_amount: number

  subtotal: number
}