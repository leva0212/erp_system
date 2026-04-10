"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

type Variant = {
  sku: string;
  name: string;
  price: number;
  active: boolean;
};

type Props = {
  variants: Variant[];
  setVariants: (v: Variant[]) => void;
};

export default function VariantPreviewTable({
  variants,
  setVariants,
}: Props) {

  const columns = useMemo<MRT_ColumnDef<Variant>[]>(
    () => [
      {
        accessorKey: "sku",
        header: "SKU",
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        size: 250,
      },
      {
        accessorKey: "price",
        header: "Precio",
        size: 100,
        Cell: ({ cell, row }) => (
          <input
            type="number"
            value={cell.getValue<number>()}
            onChange={(e) => {
              const updated = [...variants];
              updated[row.index].price = Number(e.target.value);
              setVariants(updated);
            }}
            style={{
              width: "80px",
              padding: "4px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        ),
      },
      {
        accessorKey: "active",
        header: "Activo",
        size: 80,
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.original.active}
            onChange={(e) => {
              const updated = [...variants];
              updated[row.index].active = e.target.checked;
              setVariants(updated);
            }}
          />
        ),
      },
    ],
    [variants]
  );

  return (
    <div className="border rounded">
      <MaterialReactTable
        columns={columns}
        data={variants}
        enableColumnFilters={false}
        enableGlobalFilter={false}
        enablePagination={false}
        enableTopToolbar={false}
        enableBottomToolbar={false}
        enableStickyHeader
        localization={MRT_Localization_ES}
        muiTableContainerProps={{
          sx: {
            maxHeight: 400,
            overflowY: "auto",
          },
        }}
      />
    </div>
  );
}