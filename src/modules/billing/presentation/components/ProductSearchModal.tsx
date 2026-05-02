"use client"

import { useEffect, useRef, useState } from "react"
import { useThemeClasses } from "@/theme/useThemeClasses"
import { usePOS } from "@/modules/billing/presentation/context/POSContext"
import VariantsTable from "@/modules/billing/presentation/components/VariantsTable"
import IconButton from "@/modules/shared/components/IconButton"
import { X } from "lucide-react"

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

  const inputRef = useRef<HTMLInputElement | null>(null) // 👈 agregado

  useEffect(() => {
    if (open) {
      setGlobalFilter("")

      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    }
  }, [open])

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
            Buscar producto
          </h2>

          <IconButton
            icon={<X size={25} className="text-red-600" />}
            title="Cerrar"
            onClick={onClose}
          />
        </div>

        <VariantsTable
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onSelect={handleSelectVariant}
          inputRef={inputRef} // 👈 agregado
        />
      </div>
    </div>
  )
}