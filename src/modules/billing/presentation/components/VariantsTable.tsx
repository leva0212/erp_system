"use client"

import { useMemo } from "react"
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table"
import { MRT_Localization_ES } from "material-react-table/locales/es"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/modules/shared/lib/supabaseClient"

type Variant = {
  id: number
  sku: string
  variant_name: string
  price: number
}

export default function VariantsTable({
  globalFilter,
  onGlobalFilterChange,
  onSelect,
}: {
  globalFilter: string
  onGlobalFilterChange: (v: string) => void
  onSelect: (variant: any) => void
}) {
  const { data = [] } = useQuery({
    queryKey: ["variants", globalFilter],
    queryFn: async () => {
      let query = supabase
        .from("variants")
        .select("id, sku, price, variant_name")
        .limit(50)

      if (globalFilter) {
        query = query.ilike(
          "variant_name",
          `%${globalFilter}%`
        )
      }

      const { data } = await query

      return data || []
    },
  })

  const columns = useMemo<MRT_ColumnDef<Variant>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "sku", header: "Código" },
      { accessorKey: "variant_name", header: "Nombre" },
      { accessorKey: "price", header: "Precio" },
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
      renderTopToolbarCustomActions={() => (
        <input
          type="text"
          placeholder="Buscar variantes..."
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