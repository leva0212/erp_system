import { useTheme } from "./ThemeProvider";

export function useThemeClasses() {
  const { theme } = useTheme();
  return theme;
}