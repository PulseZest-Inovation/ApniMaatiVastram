import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rules section
  {
    rules: {
      // Disable the 'no-explicit-any' rule for TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      // Add more rules as needed
    },
  },
];

export default eslintConfig;
