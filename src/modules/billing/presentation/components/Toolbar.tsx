"use client";

import {
  Plus,
  Edit,
  Printer,
  Trash2,
  Save,
  X,
  Search,
  Copy,
} from "lucide-react";

import IconButton from "@/modules/shared/components/IconButton";

export default function Toolbar() {
  return (
    <div className="flex gap-2 p-[2px] border-b bg-gray-50">

      <IconButton
        icon={<Plus size={16} className="text-green-600" />}
        label="Nueva"
        title="Nueva factura"
        onClick={() => console.log("Nueva factura")}
      />

      <IconButton
        icon={<Edit size={16} className="text-blue-600" />}
        label="Modificar"
        title="Modificar"
        onClick={() => console.log("Modificar")}
      />

      <IconButton
        icon={<Printer size={16} className="text-gray-700" />}
        label="Imprimir"
        title="Imprimir"
        onClick={() => console.log("Imprimir")}
      />

      <IconButton
        icon={<Trash2 size={16} className="text-red-600" />}
        label="Eliminar"
        title="Eliminar"
        variant="danger"
        onClick={() => console.log("Eliminar")}
      />

      <IconButton
        icon={<Save size={16} className="text-purple-600" />}
        label="Guardar"
        title="Guardar"
        variant="success"
        onClick={() => console.log("Guardar")}
      />

      <IconButton
        icon={<X size={16} className="text-red-500" />}
        label="Cancelar"
        title="Cancelar"
        onClick={() => console.log("Cancelar")}
      />

      <IconButton
        icon={<Search size={16} className="text-gray-700" />}
        label="Buscar"
        title="Buscar"
        onClick={() => console.log("Buscar")}
      />

      <IconButton
        icon={<Copy size={16} className="text-indigo-600" />}
        label="Copiar"
        title="Copiar"
        onClick={() => console.log("Copiar")}
      />

    </div>
  );
}