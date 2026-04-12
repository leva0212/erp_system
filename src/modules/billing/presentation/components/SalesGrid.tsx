"use client";

import { useEffect, useRef } from "react";
import { usePOS } from "../context/POSContext";
import { useThemeClasses } from "@/theme/useThemeClasses";
const cols = ["sku", "qty", "price", "disc"];
const celdaCuadrada = "!rounded-none !p-0 text-center h-[30px] text-[13px] font-medium font-sans";
const focusPOs =  "!bg-gray-50 !text-gray-900 focus:!bg-white border border-gray-300 !rounded-none !px-1 !py-0 outline-none ring-0 focus:ring-0"
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

  useEffect(() => {
    const el = refs.current[selectedRow]?.[selectedCol];
    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      el.scrollIntoView({ block: "nearest" });
    }
  }, [selectedRow, selectedCol]);


  function cellClass(row: number, col: number, base: string) {
  return `
    ${base}
    ${t.input}
    ${row === selectedRow ? "!bg-blue-100" : ""}
  `
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
      className={`${t.surface} max-w-[800px] rounded-xl shadow-sm overflow-hidden`}
    >
      {/* HEADER */}

      {/* GRID SCROLL */}
      <div className="h-[350px] overflow-y-auto overflow-x-auto">
  <table className="min-w-[800px]  text-xs border-collapse">
          {/* THEAD */}
          <thead className="sticky top-0 z-10 bg-purple-900 text-white-600 min-w-[600px]">
            <tr className="text-[11px] uppercase tracking-wide">
              <th className="px-1 py-2 text-center w-[26px]">#</th>
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
                className={`${celdaCuadrada}  ${r === selectedRow ? "!bg-red-500" : ""}`}

              >
                {/* # */}
                <td className="text-center text-black">{r + 1}</td>

                {/* SKU */}
                <td>
                  <input 
                    ref={(el) => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][0] = el;
                    }}
                    value={i.sku}
                    onChange={(e) => updateCell(r, { sku: e.target.value })}
                    onKeyDown={(e) => keyNav(e, r, 0)}
                  
                     className={`${celdaCuadrada}`}
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
                    ref={(el) => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][2] = el;
                    }}
                    value={i.price}
                    onChange={(e) =>
                      updateCell(r, { price: Number(e.target.value) })
                    }
                    onKeyDown={(e) => keyNav(e, r, 2)}
                   className={`${celdaCuadrada}`}
                  />
                </td>

                {/* DESCUENTO */}
                <td>
                  <input
                    ref={(el) => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][3] = el;
                    }}
                    value={i.discount_amount}
                    onChange={(e) =>
                      updateCell(r, { discount_amount: Number(e.target.value) })
                    }
                    onKeyDown={(e) => keyNav(e, r, 3)}
                    className={`${celdaCuadrada}`}
                  />
                </td>

                {/* SUBTOTAL */}
                <td>
                  <input
                    value={i.subtotal.toLocaleString()}
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
        <div className="px-3 py-2 border-b  flex justify-between items-center">
          <span className="text-xs text-red-500">{items.length} líneas</span>
        </div>
        <span className="text-lg text-gray-500"></span>

        <div className="text-left">
          <div className="text-lg font-bold text-red-600 tracking-tight">
            <span className="text-lg text-red-500">Total:</span> ₡{" "}
            {total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
