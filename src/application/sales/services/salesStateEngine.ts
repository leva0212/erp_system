import { calculateStatus } from "@/domain/sales/SalesRules"

export function updateStatus(total: number, paid: number) {
  return calculateStatus(paid, total)
}