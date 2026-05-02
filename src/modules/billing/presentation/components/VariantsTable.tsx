"use client"

import { useMemo } from "react"
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table"
import { MRT_Localization_ES } from "material-react-table/locales/es"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/modules/shared/lib/supabaseClient"
import { Variant } from "@/modules/products/domain/variant"

export default function VariantsTable({
  globalFilter,
  onGlobalFilterChange,
  onSelect,
  inputRef, // 👈 agregado
}: {
  globalFilter: string
  onGlobalFilterChange: (v: string) => void
  onSelect: (variant: any) => void
  inputRef?: React.RefObject<HTMLInputElement | null> // 👈 agregado
}) {
  const { data = [] } = useQuery<Variant[]>({
    queryKey: ["variants", globalFilter],

    queryFn: async (): Promise<Variant[]> => {
      let query = supabase
        .from("variants")
        .select("id, sku, price, variant_name")
        .limit(50)

      if (globalFilter.trim()) {
        const terms = globalFilter
          .trim()
          .split(/\s+/)
          .map(term => term.trim())
          .filter(Boolean)

        if (terms.length > 0) {
          const orQuery = terms
            .map(term => {
              const conditions: string[] = []

              // 🔎 Nombre (parcial, usa pg_trgm)
              conditions.push(`variant_name.ilike.%${term}%`)

              // 🎯 ID exacto (solo si es número)
              if (!isNaN(Number(term))) {
                conditions.push(`id.eq.${term}`)
              }

              // 🎯 SKU exacto
              conditions.push(`sku.eq.${term}`)

              // 🔎 SKU parcial
              conditions.push(`sku.ilike.%${term}%`)

              return conditions.join(",")
            })
            .join(",")

          query = query.or(orQuery)
        }
      }

      const { data, error } = await query

      if (error) {
        console.error(error)
        return []
      }

      return (data ?? []) as Variant[]
    },
  })

  const columns = useMemo<MRT_ColumnDef<Variant>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "sku", header: "Código" },
      { accessorKey: "variant_name", header: "Nombre" },
      {
        accessorKey: "price",
        header: "Precio",
        Cell: ({ cell }) => {
          const value = cell.getValue<number>() ?? 0

          return value.toLocaleString("es-CR", {
            style: "currency",
            currency: "CRC",
          })
        },
      },
    ],
    []
  )

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnFilters={false}
      enableGlobalFilter={false}
      enablePagination
      enableTopToolbar
      localization={MRT_Localization_ES}
      muiTableContainerProps={{
        sx: {
          maxHeight: "250px",
        },
      }}
      renderTopToolbarCustomActions={() => (
        <input
          ref={inputRef} // 👈 agregado
          type="text"
          placeholder="Buscar productos..."
          value={globalFilter}
          onChange={e => onGlobalFilterChange(e.target.value)}
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
            width: 250,
          }}
        />
      )}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () =>
          onSelect({
            id: row.original.id,
            sku: row.original.sku,
            name: row.original.variant_name,
            price: row.original.price,
          }),
        sx: { cursor: "pointer" },
      })}
    />
  )
}