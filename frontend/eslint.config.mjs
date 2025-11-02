import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
    // Extends the recommended Next.js configurations
    ...compat.extends("next/core-web-vitals"),

    // Adds a custom rule to disable the error for using 'any' type
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];

export default eslintConfig;
