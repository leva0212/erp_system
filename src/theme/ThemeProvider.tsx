"use client";

import { createContext, useContext, useState } from "react";
import { theme, ThemeMode } from "../theme/theme";

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: typeof theme.light;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: any) {
  const [mode, setMode] = useState<ThemeMode>("light");

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        theme: theme[mode],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}