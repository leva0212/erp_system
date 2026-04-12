"use client"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { POSProvider } from "@/modules/billing/presentation/context/POSContext"
import CodeInput from "@/modules/billing/presentation/components/CodeInput"
import SalesGrid from "@/modules/billing/presentation/components/SalesGrid"
import ProductSearchModal from "@/modules/billing/presentation/components/ProductSearchModal"

import { useThemeClasses } from "@/theme/useThemeClasses"

// 🔥 IMPORTANTE: usar application layer
import { getVariants } from "@/modules/products/application/getVariants"

export default function POSPage() {
  const [openSearch, setOpenSearch] = useState(false)

  const t = useThemeClasses()
  const queryClient = useQueryClient()

  // 🔥 PREFETCH LIMPIO (arquitectura correcta)
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["variants", ""],
      queryFn: () => getVariants(""),
    })
  }, [queryClient])

  return (
    <POSProvider>
      <div className={`${t.background} min-h-screen p-6`}>

        {/* 🔥 INPUT GLOBAL (comandos POS) */}
        <CodeInput openSearch={() => setOpenSearch(true)} />

        {/* 🔥 GRID PRINCIPAL */}
        <SalesGrid />

        {/* 🔥 MODAL DE BÚSQUEDA DE VARIANTES */}
        <ProductSearchModal
          open={openSearch}
          onClose={() => setOpenSearch(false)}
        />

      </div>
    </POSProvider>
  )
}