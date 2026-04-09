"use client";

import { useState, useEffect } from "react";
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

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es pantalla móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false);
  };

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
      if (isMobile) setIsOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <>
      {/* Botón menú móvil */}
      {isMobile && (
        <button
          className="p-2 m-2 text-white bg-gray-900 rounded-md fixed top-2 left-2 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen
          bg-gray-800
          text-white
          p-5
          flex flex-col
          transition-transform duration-300
          ${isMobile
            ? `fixed top-0 left-0 w-64 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : "relative w-64 translate-x-0 flex-shrink-0"
          }
        `}
      >
        {/* Título */}
        <h1 className="text-xl font-bold mb-6">LEVA Systems</h1>

        {/* Navegación */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`px-3 py-2 rounded hover:bg-gray-700 transition ${
                pathname === item.href ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Zona inferior */}
        <div className="mt-auto">
          <div className="border-t border-gray-700 my-4"></div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}