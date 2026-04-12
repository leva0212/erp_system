"use client"

import { useState } from "react"
import { POSProvider } from "@/modules/billing/presentation/context/POSContext"
import CodeInput from "@/modules/billing/presentation/components/CodeInput"
import SalesGrid from "@/modules/billing/presentation/components/SalesGrid"
import ProductSearchModal from "@/modules/billing/presentation/components/ProductSearchModal"
import { useThemeClasses } from "@/theme/useThemeClasses"

export default function POSPage() {
  const [open, setOpen] = useState(false)
  const t = useThemeClasses()

  return (
    <POSProvider>
      <div className={`${t.background} h-screen overflow-hidden p-3`}>
        
        <CodeInput openSearch={() => setOpen(true)} />

        <SalesGrid />

        <ProductSearchModal open={open} onClose={() => setOpen(false)} />

      </div>
    </POSProvider>
  )
}