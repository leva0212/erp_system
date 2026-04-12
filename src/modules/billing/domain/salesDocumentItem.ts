export interface SalesDocumentItem {
  variant_id: number

  sku: string
  name: string

  quantity: number

  base_price: number   // referencia
  price: number        // 🔥 editable por venta

  discount_amount: number
  discount_percent: number

  subtotal: number
}