"use client"

import { useEffect, useState } from "react"
import { useThemeClasses } from "@/theme/useThemeClasses"
import { usePOS } from "../context/POSContext"
import { supabase } from "@/modules/shared/lib/supabaseClient"

type Variant = {
  id: number
  sku: string
  name: string
  price: number
}

export default function ProductSearch({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const t = useThemeClasses()
  const { selectedRow, setVariantToRow } = usePOS()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Variant[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    async function search() {
      const { data } = await supabase
        .from("variants")
        .select("id, sku, price, variant_name")
        .ilike("variant_name", `%${query}%`)
        .limit(10)

      if (!data) return

      setResults(
        data.map(v => ({
          id: v.id,
          sku: v.sku,
          name: v.variant_name,
          price: v.price,
        }))
      )
    }

    search()
  }, [query])

  function selectVariant(v: Variant) {
    setVariantToRow(selectedRow, v)
    onClose()
    setQuery("")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`${t.surface} w-[500px] p-4 rounded shadow`}>
        
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === "ArrowDown") {
              setSelectedIndex(i =>
                i < results.length - 1 ? i + 1 : i
              )
            }

            if (e.key === "ArrowUp") {
              setSelectedIndex(i => (i > 0 ? i - 1 : 0))
            }

            if (e.key === "Enter") {
              const v = results[selectedIndex]
              if (v) selectVariant(v)
            }

            if (e.key === "Escape") {
              onClose()
            }
          }}
          placeholder="Buscar variante..."
          className={`w-full p-2 mb-2 border ${t.input}`}
        />

        <div className="max-h-60 overflow-y-auto">
          {results.map((v, i) => (
            <div
              key={v.id}
              onClick={() => selectVariant(v)}
              className={`p-2 cursor-pointer ${
                i === selectedIndex
                  ? "bg-purple-500 text-white"
                  : t.text
              }`}
            >
              <div className="flex justify-between">
                <span>{v.name}</span>
                <span>₡ {v.price}</span>
              </div>
              <div className={`text-xs ${t.textMuted}`}>
                {v.sku}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}