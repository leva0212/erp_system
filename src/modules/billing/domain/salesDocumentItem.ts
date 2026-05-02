export type SalesDocumentItem = {
  variant_id: number

  sku: string
  name: string

  quantity: number

  price: number
  base_subtotal: number

  discount_percent: number
  discount_amount: number

  tax_percent: number
  tax_amount: number

  subtotal: number

  max_discount_percent: number
  allow_discount: boolean

  // 🔥 FALTABA ESTE
  cost: number
}