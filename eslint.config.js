import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";


export default [
  eslintConfigPrettier,
  {files: ["source/**/*.{js,ts,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  { rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": "warn",
      "prefer-const": "warn",
  }
 },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];