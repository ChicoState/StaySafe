import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    rules: {
      "complexity": ["error", { "max": 10, "variant": "classic"}],
      "no-unused-vars": "error",
      "no-undef": "error"
    }
  },
  pluginJs.configs.recommended,
];