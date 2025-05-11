import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        ".astro",
        ".obsidian",
        "dist",
        "node_modules",
        ".vercel"
    ]),
    tseslint.configs.recommended,
    eslintPluginAstro.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,astro}"],
        languageOptions: { globals: globals.browser },
        plugins: {
            js,
            "@stylistic":stylistic
        },
        extends: ["js/recommended"],
        rules: {
            "@typescript-eslint/no-unused-vars": "off", // Duplicate
            "no-unused-vars": "warn",
            "no-empty": "warn",
            "@stylistic/indent": ["warn", 4],
            "@stylistic/quotes": ["warn", "double"],
            "@stylistic/semi": ["error"],
            "@stylistic/arrow-spacing": ["warn"],
            "@stylistic/brace-style": ["error"],
            "@stylistic/comma-dangle": ["error","never"]
        }
    }
]);
