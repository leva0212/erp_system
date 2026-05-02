"use client";

import { useState } from "react";
import { POSProvider } from "@/modules/billing/presentation/context/POSContext";
import { useThemeClasses } from "@/theme/useThemeClasses";

export default function POSPage() {
  const [open, setOpen] = useState(false);
  const t = useThemeClasses();

  return (
    <POSProvider>
      <div className={`${t.background} h-screen overflow-hidden p-3`}>
        <h1 className={`${t.text} text-2xl font-bold mb-4 text-red-700`}>
          LEVA Systems
        </h1>
      </div>
    </POSProvider>
  );
}
