"use client"

import { useSalesDocument } from "../hooks/useSalesDocument"
import { useThemeClasses } from "@/theme/useThemeClasses"

export default function SalesTable() {
  const { items, totals, handleUpdate, handleRemove } =
    useSalesDocument()

  const t = useThemeClasses()

  return (
    <div className={`${t.surface} shadow rounded-lg overflow-hidden border ${t.border}`}>
      
      <table className="w-full text-sm">
        <thead className={`${t.surface} ${t.textMuted}`}>
          <tr>
            <th className="p-3 text-left">Producto</th>
            <th className="p-3 text-center">Cant</th>
            <th className="p-3 text-center">Precio</th>
            <th className="p-3 text-center">Desc</th>
            <th className="p-3 text-right">Subtotal</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr
              key={item.variant_id}
              className={`border-t ${t.border} hover:opacity-80`}
            >
              <td className="p-3 font-medium">{item.name}</td>

              <td className="p-3 text-center">
                <input
                  className={`w-16 border rounded px-2 text-center ${t.input}`}
                  value={item.quantity}
                  onChange={e =>
                    handleUpdate(item.variant_id, {
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </td>

              <td className="p-3 text-center">
                <input
                  className={`w-24 border rounded px-2 text-center ${t.input}`}
                  value={item.price}
                  onChange={e =>
                    handleUpdate(item.variant_id, {
                      price: Number(e.target.value),
                    })
                  }
                />
              </td>

              <td className="p-3 text-center">
                <input
                  className={`w-20 border rounded px-2 text-center ${t.input}`}
                  value={item.discount_amount}
                  onChange={e =>
                    handleUpdate(item.variant_id, {
                      discount_amount: Number(e.target.value),
                    })
                  }
                />
              </td>

              <td className="p-3 text-right font-semibold">
                ₡ {item.subtotal.toLocaleString()}
              </td>

              <td className="p-3 text-center">
                <button
                  onClick={() => handleRemove(item.variant_id)}
                  className={t.buttonDanger}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div className={`p-4 border-t ${t.border} text-right`}>
        <p className={t.textMuted}>
          Subtotal: ₡ {totals.subtotal.toLocaleString()}
        </p>

        <p className={t.textMuted}>
          Descuento: ₡ {totals.discount_total.toLocaleString()}
        </p>

        <p className={`text-xl font-bold ${t.text}`}>
          Total: ₡ {totals.total.toLocaleString()}
        </p>
      </div>
    </div>
  )
}