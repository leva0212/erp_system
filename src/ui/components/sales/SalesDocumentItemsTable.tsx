"use client"



export default function SalesDocumentItemsTable({
  items,
  setItems,
}: any) {

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "Producto nuevo",
        quantity: 1,
        price: 0,
        discount_percent: 0,
        subtotal: 0,
      },
    ])
  }

  return (
    <div className="border p-3 rounded">

      
    </div>
  )
}