"use client"

import {
  removeItem,
  updateLineDiscount,
  updateQuantity
} from "@/src/application/sales/salesDocumentCalulator"

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

      <div className="flex justify-between mb-2">
        <h2 className="font-bold">Items</h2>

        <button
          onClick={addItem}
          className="px-2 py-1 border rounded"
        >
          + Agregar
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant</th>
            <th>Precio</th>
            <th>Desc %</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.map((item: any, index: number) => (
            <tr key={index}>

              <td>{item.name}</td>

              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    setItems(updateQuantity(items, index, Number(e.target.value)))
                  }
                />
              </td>

              <td>{item.price}</td>

              <td>
                <input
                  type="number"
                  value={item.discount_percent}
                  onChange={(e) =>
                    setItems(updateLineDiscount(items, index, Number(e.target.value)))
                  }
                />
              </td>

              <td>{item.subtotal}</td>

              <td>
                <button onClick={() => setItems(removeItem(items, index))}>
                  ❌
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}