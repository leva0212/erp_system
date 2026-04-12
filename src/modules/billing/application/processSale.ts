import { createSalesDocument } from "./createSalesDocument"
import { SalesDocumentItem } from "../domain/salesDocumentItem"

// 🔌 imports de otros módulos
import { moveInventory } from "@/modules/inventory/application/moveInventory"
import { registerPayment } from "@/modules/payments/application/registerPayment"
//import { addCashMovement } from "@/modules/cash/application/addCashMovement"

type ProcessSaleInput = {
  customer_id: number
  items: SalesDocumentItem[]
  payment_amount: number
  payment_method: "cash" | "card" | "transfer"
  cash_session_id?: number
  warehouse_id: number
}

export async function processSale(input: ProcessSaleInput) {
  const {
    customer_id,
    items,
    payment_amount,
    payment_method,
    cash_session_id,
    warehouse_id,
  } = input

  if (!items.length) {
    throw new Error("No hay items para procesar")
  }

  // 🧾 1. Crear factura
  const document = await createSalesDocument(customer_id, items)

  // 📦 2. Descontar inventario (KARDEX REAL)
  for (const item of items) {
    await moveInventory({
      variant_id: item.variant_id,
      warehouse_id,
      quantity: -item.quantity,
      movement_type: "SALE",
      reference_type: "sales_document",
      reference_id: document.id,
    })
  }

  // 💳 3. Registrar pago
  if (payment_amount > 0) {
    const payment = await registerPayment({
      customer_id,
      sales_document_id: document.id,
      amount: payment_amount,
      payment_method,
      cash_session_id,
    })

    // 🏦 4. Impactar caja
    if (payment_method === "cash" && cash_session_id) {
        console.log("Registrar movimiento de caja para pago en efectivo:");
      /*await addCashMovement({
        cash_session_id,
        amount: payment_amount,
        type: "IN",
        reference: `Venta #${document.id}`,
      })*/
    }

    return {
      document,
      payment,
    }
  }

  return {
    document,
  }
}