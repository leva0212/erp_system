import { SalesDocumentStatus } from "./SalesDocument"

export function calculateStatus(
  paid: number,
  total: number
): SalesDocumentStatus {
  if (paid <= 0) return "draft"
  if (paid > 0 && paid < total) return "partial"
  if (paid >= total) return "paid"
  return "draft"
}