"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../../../application/authService";

const navItems = [
    { name: "Inicio", href: "/" },
  { name: "Productos", href: "/products" },
  { name: "Clientes", href: "/customers" },
  { name: "Inventario", href: "/inventory" },
  { name: "Ventas", href: "/sales" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      
      {/* Título */}
      <div>
        <h1 className="text-xl font-bold mb-6">LEVA Systems</h1>

        {/* Navegación */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded hover:bg-gray-700 transition ${
                pathname === item.href ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Zona inferior */}
      <div className="mt-auto">

        {/* Separador */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition"
        >
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}