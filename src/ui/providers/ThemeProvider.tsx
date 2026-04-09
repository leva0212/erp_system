"use client";

import { createContext, useContext, useState } from "react";
import { theme } from "../theme/theme";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: any) {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: theme[mode],
        mode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);