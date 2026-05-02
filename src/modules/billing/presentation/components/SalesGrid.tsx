"use client";

import { useEffect, useRef, useState } from "react";
import { usePOS } from "../context/POSContext";
import { useThemeClasses } from "@/theme/useThemeClasses";
import { codeInputRef } from "../context/codeInputRef";
const cols = ["sku", "qty", "price", "disc"];
const celdaCuadrada =
  "!rounded-none !p-0 text-center h-[30px] text-[13px] font-medium font-sans";
//const focusPOs =  "!bg-gray-50 !text-gray-900 focus:!bg-white border border-gray-300 !rounded-none !px-1 !py-0 outline-none ring-0 focus:ring-0"

export default function SalesGrid() {
  const {
    items,
    selectedRow,
    selectedCol,
    setSelectedRow,
    setSelectedCol,
    updateCell,
  } = usePOS();

  const t = useThemeClasses();
  const refs = useRef<(HTMLInputElement | null)[][]>([]);
  const [localPrice, setLocalPrice] = useState<{
    row: number;
    value: string;
  } | null>(null);
  useEffect(() => {
    const el = refs.current[selectedRow]?.[selectedCol];

    if (!el) return;

    // 🔥 SI el foco está en CodeInput → NO tocar
    if (document.activeElement === codeInputRef.current) return;

    el.focus();

    const len = el.value.length;
    el.setSelectionRange(len, len);

    el.scrollIntoView({ block: "nearest" });
  }, [selectedRow, selectedCol]);

  /* useEffect(() => {
    const el = refs.current[selectedRow]?.[selectedCol];
    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      el.scrollIntoView({ block: "nearest" });
    }
  }, [selectedRow, selectedCol]);
*/
  function cellClass(row: number, col: number, base: string) {
    return `
    ${base}
    ${t.input}
    ${row === selectedRow ? "!bg-blue-100" : ""}
  `;
    // ${row === selectedRow && col === selectedCol ? celdaCuadrada : base}
  }
  function move(r: number, c: number) {
    setSelectedRow(Math.max(0, Math.min(r, items.length - 1)));
    setSelectedCol(Math.max(0, Math.min(c, 3)));
  }

  function keyNav(e: any, r: number, c: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(r + 1, c);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (r === 0) {
        codeInputRef.current?.focus();
        return;
      }

      move(r - 1, c);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(r, c + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(r, c - 1);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      move(r, c + 1);
    }
  }

  const total = items.reduce((a, b) => a + b.subtotal, 0);

  return (
    <div
      className={`${t.surface} max-w-[802px] rounded-xl shadow-sm overflow-hidden border border-purple-600`}
    >
      {/* HEADER */}

      {/* GRID SCROLL */}
      <div className="h-[350px] overflow-y-auto overflow-x-auto">
        <table className="min-w-[800px]">
          {/* THEAD */}
          <thead className="sticky top-0 z-10 bg-purple-900 text-white-600 min-w-[600px]">
            <tr className="text-[11px] uppercase tracking-wide">
              <th className="px-1 py-2 text-center w-[26px]"></th>
              <th className="px-1 py-2 text-left w-[60px]">Código</th>
              <th className="px-1 py-2 text-left w-[60px]">Cant</th>
              <th className="px-1 py-2 text-left ">Descripción</th>
              <th className="px-1 py-2 text-center  w-[50px]">Exis</th>
              <th className="px-1 py-2 text-center  w-[75px]">Precio</th>
              <th className="px-1 py-2 text-center  w-[60px]">Desc</th>
              <th className="px-1 py-2 text-center  w-[100px]">Subtotal</th>
            </tr>
          </thead>

          {/* TBODY */}
          <tbody>
            {items.map((i, r) => (
              <tr
                key={r}
                onClick={() => setSelectedRow(r)}
                className={`${celdaCuadrada} !bg-purple-900`}
              >
                {/* # */}
                <td className="text-center">
                  <div
                    className={`
      w-0 h-0
      border-t-[10px] border-t-transparent
      border-b-[10px] border-b-transparent
      border-l-[15px]  ${r === selectedRow ? "border-l-green-600" : "border-l-transparent"}
      mx-auto
    `}
                  />
                </td>

                {/* SKU */}
                <td>
                  <input
                    ref={(el) => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][0] = el;
                    }}
                    value={i.variant_id}
                    onChange={(e) => updateCell(r, { sku: e.target.value })}
                    onKeyDown={(e) => keyNav(e, r, 0)}
                    className={`${celdaCuadrada} !bg-yellow-50`}
                  />
                </td>

                {/* CANT */}
                <td>
                  <input
                    ref={(el) => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][1] = el;
                    }}
                    value={i.quantity}
                    onChange={(e) =>
                      updateCell(r, { quantity: Number(e.target.value) })
                    }
                    onKeyDown={(e) => keyNav(e, r, 1)}
                    className={`${celdaCuadrada}`}
                  />
                </td>

                {/* DESCRIPCIÓN */}
                <td>
                  <input
                    value={i.name}
                    readOnly
                    className={`${celdaCuadrada} !bg-yellow-50`}
                    //className={cellClass(r, 2, celdaCuadrada)}
                    //className={` ${celdaCuadrada} !bg-yellow-50 `}
                  />
                </td>

                {/* Existencia */}
                <td>
                  <input
                    value={"{}"}
                    readOnly
                    className={`${celdaCuadrada} !bg-yellow-50`}

                    //className={`${celdaCuadrada} !bg-yellow-50 `}
                    //className={`${celdaCuadrada} !bg-yellow-50 `}
                  />
                </td>

                {/* PRECIO */}
                <td>
                  <input
                    type="text"
                    inputMode="decimal"
                    ref={(el) => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][2] = el;
                    }}
                    value={
                      localPrice && localPrice.row === r
                        ? localPrice.value
                        : Number(i.price || 0).toLocaleString("es-CR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                    }
                    onChange={(e) => {
                      // 🔥 permitir solo números, coma y punto
                      const val = e.target.value.replace(/[^0-9.,]/g, "");
                      setLocalPrice({ row: r, value: val });

                      updateCell(r, {
                        discount_percent: i.discount_percent ?? 0,
                        discount_amount: i.discount_amount ?? 0,
                        price: parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0,
                      });
                      
                      
                    }}
                    onFocus={(e) => {
                      setLocalPrice({
                        row: r,
                        value: (i.price ?? 0).toString(),
                      });

                      // 🔥 cursor al final
                      const len = e.target.value.length;
                      setTimeout(() => {
                        e.target.setSelectionRange(len, len);
                      }, 0);
                    }}
                    onBlur={() => {
                      if (!localPrice || localPrice.row !== r) return;

                      // 🔥 normalizar formato
                      let raw = localPrice.value
                        .replace(/\./g, "")
                        .replace(",", ".");
                      const num = parseFloat(raw);

                      if (!isNaN(num)) {
                        updateCell(r, { price: num });
                      }

                      setLocalPrice(null);
                    }}
                    onKeyDown={(e) => keyNav(e, r, 2)}
                    className={`${celdaCuadrada} text-center`}
                  />
                </td>

                {/* DESCUENTO */}
                <td>
                  <input
                    ref={(el) => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][3] = el;
                    }}
                    value={
                      i.discount_percent !== undefined
                        ? Number(i.discount_percent)
                            .toFixed(1)
                            .replace(/\.0$/, "")
                        : ""
                    }
                    onChange={(e) => {
                      const percent =
                        Math.round((parseFloat(e.target.value) || 0) * 10) / 10;

                      const base = i.price * i.quantity;
                      const amount = (base * percent) / 100;

                      updateCell(r, {
                        discount_percent: percent,
                        discount_amount: amount,
                      });
                    }}
                    onKeyDown={(e) => keyNav(e, r, 3)}
                    className={`${celdaCuadrada}`}
                  />
                </td>

                {/* SUBTOTAL */}
                <td>
                  <input
                    value={i.subtotal.toLocaleString("es-CR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    readOnly
                    className={`${celdaCuadrada} !bg-yellow-50 `}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
        <div className="px-3 py-2 border-b flex justify-between items-center">
          <span className="text-sm text-red-500">{items.length} líneas</span>
        </div>

        <span className="text-xl text-gray-500"></span>

        <div className="text-left">
          <div className="text-2xl font-bold text-red-600 tracking-tight">
            <span className="text-xl text-red-500">Total:</span> ₡{" "}
            {total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
