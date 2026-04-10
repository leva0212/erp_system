"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Product } from "../../../domain/product";

type ProductsTableProps = {
  data: Product[];
  rowCount: number;
  pagination: MRT_PaginationState;
  globalFilter: string;
  onPaginationChange: (
    updaterOrValue:
      | MRT_PaginationState
      | ((old: MRT_PaginationState) => MRT_PaginationState),
  ) => void;
  onGlobalFilterChange: (value: string) => void;
  onEditProduct?: (product: Product) => void;
};

export default function ProductsTable({
  data,
  rowCount,
  pagination,
  globalFilter,
  onPaginationChange,
  onGlobalFilterChange,
  onEditProduct,
}: ProductsTableProps) {
  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "name", header: "Nombre" },
      { accessorKey: "description", header: "Descripción" },
      { accessorKey: "active", header: "Activo" },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      manualPagination
      manualFiltering
      rowCount={rowCount}
      state={{
        pagination,
        columnFilters: [],
        globalFilter: undefined,
      }}
      onPaginationChange={onPaginationChange}
      enableColumnFilters={false}
      enableGlobalFilter={false}
      muiTableContainerProps={{
        sx: {
          maxHeight: 400,
          overflowY: "auto",
        },
      }}
      enableStickyHeader
      enableTopToolbar
      localization={MRT_Localization_ES}
      renderTopToolbarCustomActions={() => (
        <input
          type="text"
          placeholder="Buscar productos..."
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: 250,
          }}
        />
      )}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () => onEditProduct?.(row.original),
        sx: { cursor: onEditProduct ? "pointer" : "default" },
      })}
    />
  );
}