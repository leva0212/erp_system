import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const designSystemRules = {
  rules: {
    // 🚨 PROHIBIR estilos directos críticos
    "no-restricted-syntax": [
      "error",

      // ❌ bg-white directo
      {
        selector: "Literal[value=/bg-white/]",
        message:
          "❌ No uses 'bg-white'. Usa el design system (theme.surface o tokens.surface).",
      },

      // ❌ text-white directo
      {
        selector: "Literal[value=/text-white/]",
        message:
          "❌ No uses 'text-white'. Usa theme.primary o tokens.primary.",
      },

      // ❌ bg-slate-50 directo
      {
        selector: "Literal[value=/bg-slate-50/]",
        message:
          "❌ Usa theme.background o tokens.background.",
      },

      // ❌ inline styles (muy importante ERP consistency)
      {
        selector: "JSXAttribute[name.name='style']",
        message:
          "❌ No uses inline styles. Usa el design system (theme/tokens).",
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // =========================
  // DESIGN SYSTEM ENFORCEMENT
  // =========================
  designSystemRules,

  // =========================
  // IGNORES
  // =========================
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;