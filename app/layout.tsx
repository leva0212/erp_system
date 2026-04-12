"use client"

import { usePathname } from "next/navigation"
import Sidebar from "../src/ui/components/layout/Sidebar"
import AuthGuard from "../src/ui/components/AuthGuard"
import "./globals.css"

import { ThemeProvider } from "@/theme/ThemeProvider"
import QueryProvider from "@/providers/QueryProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isLoginPage = pathname === "/login"

  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <ThemeProvider>

            {isLoginPage ? (
              children
            ) : (
              <AuthGuard>
                <div className="flex h-screen">

                  <Sidebar />

                  <main className="flex-1 bg-gray-100 p-2 md:p-8 overflow-auto">
                    {children}
                  </main>

                </div>
              </AuthGuard>
            )}

          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}