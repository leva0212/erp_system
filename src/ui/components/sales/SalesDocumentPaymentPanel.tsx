export default function SalesDocumentPaymentPanel({
  items,
  payments,
  setPayments,
}: any) {

  const total = items.reduce((s: number, i: any) => s + (i.subtotal || 0), 0)
  const paid = payments.reduce((s: number, p: any) => s + p.amount, 0)

  return (
    <div className="border p-3 rounded">

      <h2 className="font-bold">Pagos</h2>

      <p>Total: {total}</p>
      <p>Pagado: {paid}</p>
      <p>Pendiente: {total - paid}</p>

      <input
        type="number"
        placeholder="Monto"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setPayments([
              ...payments,
              { amount: Number((e.target as any).value) },
            ])
          }
        }}
      />
    </div>
  )
}