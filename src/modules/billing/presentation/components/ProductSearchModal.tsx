"use client"

import { useState } from "react"
import { useThemeClasses } from "@/theme/useThemeClasses"
import { usePOS } from "@/modules/billing/presentation/context/POSContext"
import VariantsTable from "@/modules/billing/presentation/components/VariantsTable"

export default function ProductSearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const t = useThemeClasses()
  const { selectedRow, setVariantToRow } = usePOS()

  const [globalFilter, setGlobalFilter] = useState("")

  if (!open) return null

  function handleSelectVariant(variant: any) {
    setVariantToRow(selectedRow, variant)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`${t.surface} w-[800px] p-4 rounded shadow`}>
        
        <div className="flex justify-between mb-2">
          <h2 className={`text-lg ${t.text}`}>
            Buscar variante
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <VariantsTable
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onSelect={handleSelectVariant}
        />
      </div>
    </div>
  )
}