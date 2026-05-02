"use client";

import { CheckCircle, AlertTriangle, XCircle, HelpCircle, X } from "lucide-react";
import React from "react";

type Variant = "success" | "warning" | "error" | "confirm";

type Props = {
  open: boolean;
  title?: string;
  message: string;

  variant?: Variant;

  onClose: () => void;

  // solo confirm
  onConfirm?: () => void;
};

export default function AlertDialog({
  open,
  title,
  message,

  variant = "warning",

  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  const config = {
    success: {
      title: title || "Operación Exitosa",
      icon: <CheckCircle size={18} className="text-green-600" />,
      bar: "bg-green-600",
      button: "bg-green-600 hover:bg-green-700 text-white",
    },

    warning: {
      title: title || "Advertencia",
      icon: <AlertTriangle size={18} className="text-yellow-600" />,
      bar: "bg-yellow-500",
      button: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },

    error: {
      title: title || "Error",
      icon: <XCircle size={18} className="text-red-600" />,
      bar: "bg-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },

    confirm: {
      title: title || "Confirmar Acción",
      icon: <HelpCircle size={18} className="text-blue-600" />,
      bar: "bg-purple-900",
      button: "bg-purple-600 hover:bg-gray-700 text-white",
    },
  };

  const c = config[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[400px] overflow-hidden border bg-white shadow-xl">

        {/* HEADER */}
        <div className={`${c.bar} flex items-center justify-between px-3 py-2 text-white`}>
          <div className="flex items-center gap-2">
            {c.icon}
            <span className="text-sm font-semibold">
              {c.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-red-600 hover:bg-red-700 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 text-sm text-gray-700">
          {message}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 border-t px-3 py-2">

          {/* CANCEL */}
          {variant === "confirm" && (
            <button
              onClick={onClose}
              className="border bg-orange-600 px-3 py-1 text-sm hover:bg-gray-700"
            >
              Cancelar
            </button>
          )}

          {/* OK / CONFIRM */}
          <button
            onClick={() => {
              if (variant === "confirm" && onConfirm) {
                onConfirm();
              }

              onClose();
            }}
            className={`px-3 py-1 text-sm ${c.button}`}
          >
            {variant === "confirm" ? "Aceptar" : "Cerrar"}
          </button>

        </div>

      </div>
    </div>
  );
}