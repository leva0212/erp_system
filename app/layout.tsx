"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "../src/ui/components/layout/Sidebar";
import "./globals.css";
import AuthGuard from "../src/ui/components/AuthGuard";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "../src/ui/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="es">
      <body><ThemeProvider>

        {isLoginPage ? (
          children
        ) : (
          <AuthGuard>
            <div className="flex h-screen">

              <Sidebar />

              <main className="flex-1 bg-gray-100 p-8 overflow-auto">
                {children}
              </main>

            </div>
          </AuthGuard>
        )}

      </ThemeProvider>

      </body>
    </html>
  );
}