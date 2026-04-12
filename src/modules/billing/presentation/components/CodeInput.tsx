"use client"

import { useState } from "react"
import { usePOS } from "../context/POSContext"
import { useThemeClasses } from "@/theme/useThemeClasses"
import { getVariants } from "@/modules/products/application/getVariants"

export default function CodeInput({ openSearch }: any) {
  const [value, setValue] = useState("")
  const t = useThemeClasses()

  const {
    selectedRow,
    setVariantToRow,
    removeRow,
    updateCell,
    setAllQuantities,
    applyDiscountPercentRow,
    applyDiscountPercentAll,
    selectedCol,
    setSelectedRow,
    setSelectedCol,
  } = usePOS()

  async function findVariantSmart(code: string) {
    const list = await getVariants("")
    return list.find(v =>
      /^\d+$/.test(code)
        ? v.id === Number(code)
        : v.sku === code
    )
  }

  async function handleCommand(input: string) {
    if (!input) return

    if (input === "+") {
      openSearch()
      return
    }

    if (input === "-") {
      removeRow(selectedRow)
      return
    }

    if (input.startsWith("**")) {
      setAllQuantities(Number(input.replace("**", "")))
      return
    }

    if (input.startsWith("%%")) {
      applyDiscountPercentAll(Number(input.replace("%%", "")))
      return
    }

    if (input.startsWith("%")) {
      applyDiscountPercentRow(selectedRow, Number(input.replace("%", "")))
      return
    }

    if (input.startsWith("*")) {
      updateCell(selectedRow, {
        quantity: Number(input.replace("*", "")),
      })
      return
    }

    let code = input
    let qty = 1

    if (input.includes("*")) {
      const [c, q] = input.split("*")
      code = c
      qty = Number(q)
    }

    const v = await findVariantSmart(code)
    if (v) setVariantToRow(selectedRow, v, qty)

    setValue("")
  }

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter") handleCommand(value)

        if (e.key === "ArrowDown") setSelectedRow(selectedRow + 1)
        if (e.key === "ArrowUp") setSelectedRow(selectedRow - 1)
        if (e.key === "ArrowRight") setSelectedCol(selectedCol + 1)
        if (e.key === "ArrowLeft") setSelectedCol(selectedCol - 1)
      }}
      onWheel={e => {
        if (e.deltaY > 0) setSelectedRow(selectedRow + 1)
        else setSelectedRow(selectedRow - 1)
      }}
      className={`w-[150px] min-w-[150] max-w-[100px] max-h-[40px] p-2 mb-2 bg-pink-200/40 border rounded ${t.input}`}
      //placeholder="+ buscar | comandos"
    />
  )
}