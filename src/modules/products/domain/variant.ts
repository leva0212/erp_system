export type Variant = {
  id: number
  product_id: number 
  variant_name: string

  sku: string

  price: number
  cost: number

  max_discount_percent: number

  tax_type: "taxed" | "exempt"
  tax_percent: number

  active: boolean
 
}

export function calculateProfit(v: Variant) {
  const profit = v.price - v.cost
  const percent = v.cost > 0 ? (profit / v.cost) * 100 : 0

  return {
    profit,
    percent,
  }
}