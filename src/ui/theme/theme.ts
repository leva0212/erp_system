export type ThemeMode = "light" | "dark";

export type Theme = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;

  primary: string;
  primaryHover: string;

  success: string;
  danger: string;
  warning: string;

  input: string;

  // 🔥 variants (tipo Shopify Polaris)
  buttonPrimary: string;
  buttonSecondary: string;
  buttonDanger: string;
};

export const theme = {
  light: {
    background: "bg-slate-50",
    surface: "bg-white",
    text: "text-gray-900",
    textMuted: "text-gray-500",
    border: "border-gray-200",

    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",

    success: "bg-green-600",
    danger: "bg-red-600",
    warning: "bg-yellow-500",

    input: "bg-white border-gray-300 text-gray-900",

    // 🔥 UI variants (IMPORTANTE)
    buttonPrimary: "bg-purple-600 text-white hover:bg-purple-700",
    buttonSecondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    buttonDanger: "bg-red-600 text-white hover:bg-red-700",
  },

  dark: {
    background: "bg-slate-900",
    surface: "bg-slate-800",
    text: "text-gray-100",
    textMuted: "text-gray-400",
    border: "border-slate-700",

    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",

    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-400",

    input: "bg-slate-800 border-slate-600 text-white",

    buttonPrimary: "bg-purple-600 text-white hover:bg-purple-700",
    buttonSecondary: "bg-slate-700 text-white hover:bg-slate-600",
    buttonDanger: "bg-red-500 text-white hover:bg-red-600",
  },
};