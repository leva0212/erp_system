"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  POSProvider,
  usePOS,
} from "@/modules/billing/presentation/context/POSContext";
import CodeInput from "@/modules/billing/presentation/components/CodeInput";
import SalesGrid from "@/modules/billing/presentation/components/SalesGrid";
import ProductSearchModal from "@/modules/billing/presentation/components/ProductSearchModal";

import { useThemeClasses } from "@/theme/useThemeClasses";

// 🔥 IMPORTANTE: usar application layer
import { getVariants } from "@/modules/products/application/getVariants";
import IconButton from "@/modules/shared/components/IconButton";
import Toolbar from "@/modules/billing/presentation/components/Toolbar";
import { Plus, Trash } from "lucide-react";
import { codeInputRef } from "@/modules/billing/presentation/context/codeInputRef";

export default function POSPage() {
  return (
    <POSProvider>
      <POSContent />
    </POSProvider>
  );
}

function POSContent() {
  const [openSearch, setOpenSearch] = useState(false);

  const t = useThemeClasses();
  const queryClient = useQueryClient();

  const { selectedRow, removeRow, items } = usePOS(); // ✅ ahora sí funciona

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["variants", ""],
      queryFn: () => getVariants(""),
    });
  }, [queryClient]);

  function handleCloseSearch() {
    setOpenSearch(false);

    setTimeout(() => {
      codeInputRef.current?.focus();
    }, 0);
  }

  return (
    <div className={`${t.background} min-h-screen !py-1 !px-1 `}>
      {/* TOOLBAR */}
      <Toolbar />

      {/* ROW NOMBRE CLIENTE */}
      <div className="flex gap-2 p-[1px] items-center">
        <span
          className={`${t.text} font-bold text-black-700 w-[100px] text-right shrink-0`}
        >
          Cliente:
        </span>

        <input
          type="text"
          className={`${t.input} !h-[30px] !px-[2px] !py-[0px] text-sm leading-none max-w-[50px]`}
        />

        <input
          type="text"
          className={`${t.input} !h-[30px] !px-[2px] !py-[0px] text-sm leading-none max-w-[250px]`}
          placeholder="Cliente contable"
        />
      </div>

      <div className="flex gap-2 p-[1px] items-center">
        <span
          className={`${t.text} font-bold text-black-700 w-[100px] text-right shrink-0`}
        >
          Nombre:
        </span>

        <input
          type="text"
          className={`${t.input} !h-[30px] !px-[2px] !py-[0px] text-sm leading-none max-w-[250px]`}
          placeholder="Nombre del cliente"
        />
        {/* Tipo factura */}
        <span
          className={`${t.text} font-bold text-black-700 w-[30px] text-right shrink-0`}
        >
          Tipo:
        </span>
        <select
          className={`${t.input} !h-[30px] !px-[2px] !py-[0px] text-sm leading-none max-w-[200px] !border !border-gray-300 focus:!border-purple-500`}
        >
          <option value="">Seleccionar</option>
          <option value="factura">FACTURA DE CONTADO</option>
          <option value="boleta">APARTADO</option>
          <option value="boleta">PROFORMA</option>
        </select>
      </div>
      {/* ROW VENDEDOR */}
      <div className="flex gap-2 p-[1px] items-center py-[1px]">
        <span
          className={`${t.text} font-bold text-black-700 w-[100px] text-right shrink-0`}
        >
          Vendedor:
        </span>

        <input
          type="text"
          className={`${t.input} !h-[30px] !px-[2px] !py-[0px] text-sm leading-none max-w-[250px]`}
          placeholder="Nombre del vendedor"
        />
        {/* Forma de pago */}
        <span
          className={`${t.text} font-bold text-black-700  text-right shrink-0`}
        >
          Forma de pago:
        </span>
        <select
          className={`${t.input} !h-[30px] !px-[2px] !py-[0px] text-sm leading-none max-w-[200px] !border !border-gray-300 focus:!border-purple-500`}
        >
          <option value="">FORMA DE PAGO</option>
          <option value="factura">EFECTIVO</option>
          <option value="boleta">TARJETA</option>
          <option value="boleta">SINPE MÓVIL</option>
          <option value="boleta">TRANSFERENCIA</option>
          <option value="boleta">CHEQUE</option>
        </select>
      </div>

      {/* 🔥 INPUT GLOBAL */}
      <div className="w-[700px] flex justify-center px-[2px] gap-x-2 ">
  {/* hijos aquí */}
    <CodeInput openSearch={() => setOpenSearch(true)} />
      {/* ➕ Agregar */}
        <IconButton
          icon={<Plus size={16} className="text-purple-600" />}
          title="Agregar producto"
          onClick={() => {
            setOpenSearch(true);
          }}
        />

        {/* 🗑️ Eliminar fila seleccionada */}
        <IconButton
          icon={<Trash size={16} className="text-red-600" />}
          title="Eliminar línea"
          onClick={() => {
            if (
              selectedRow === null ||
              selectedRow === undefined ||
              items.length === 1
            )
              return;

            const safeIndex = Math.min(selectedRow, items.length - 1);
            const row = items[safeIndex];

            if (!row) return;

            const isOnlyRow = items.length === 1;

            const isEmptyRow = row.variant_id === 0;

            // 🔥 DEBUG (temporal, te ayuda a ver qué pasa)
            console.log({ row, isOnlyRow, isEmptyRow });

            if (isOnlyRow && isEmptyRow) return;

            removeRow(safeIndex);
          }}
        />
</div>
   

      {/* GRID */}
      <SalesGrid />

      {/* MODAL */}
      <ProductSearchModal open={openSearch} onClose={handleCloseSearch} />
    </div>
  );
}
