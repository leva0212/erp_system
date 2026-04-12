"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { searchVariantsUseCase } from "@/application/variants/searchVariantsUseCase";

type Variant = {
  id: number;
  sku: string;
  variant_name: string;
  price: number;
  stock: number;
  product_id: number;
  product_name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (variant: Variant) => void;
};

export default function VariantPickerModal({
  open,
  onClose,
  onSelect,
}: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [search, setSearch] = useState("");
  const [onlyStock, setOnlyStock] = useState(true);

  async function loadVariants() {
    const data = await searchVariantsUseCase({
      search,
      onlyStock,
    });

    setVariants(data);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadVariants();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, onlyStock]);

  const columns = useMemo<MRT_ColumnDef<Variant>[]>(
    () => [
      {
        accessorKey: "sku",
        header: "SKU",
      },
      {
        accessorKey: "variant_name",
        header: "Variante",
      },
      {
        accessorKey: "product_name",
        header: "Producto",
      },
      {
        accessorKey: "price",
        header: "Precio",
      },
      {
        accessorKey: "stock",
        header: "Stock",
      },
    ],
    []
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Seleccionar producto</DialogTitle>

      <DialogContent>

        <Box sx={{ mb: 2 }}>

          <TextField
            label="Buscar SKU o nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={onlyStock}
                onChange={(e) => setOnlyStock(e.target.checked)}
              />
            }
            label="Solo con stock"
          />

        </Box>

        <MaterialReactTable
          columns={columns}
          data={variants}

          enableSorting
          enablePagination

          muiTableBodyRowProps={({ row }) => ({
            onDoubleClick: () => {
              onSelect(row.original);
              onClose();
            },
            style: { cursor: "pointer" },
          })}
        />

      </DialogContent>
    </Dialog>
  );
}