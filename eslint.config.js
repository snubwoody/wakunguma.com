import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginAstro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
    globalIgnores([
        ".astro",
        ".obsidian",
        "dist",
        "node_modules",
        ".vercel",
    ]),
    tseslint.configs.recommended,
    eslintPluginAstro.configs.recommended,
    { 
        files: ["**/*.{js,mjs,cjs,ts}"], 
        plugins: { js }, 
        extends: ["js/recommended"] ,
        
    },
    { 
        files: ["**/*.{js,mjs,cjs,ts}"], 
        languageOptions: { globals: globals.browser } 
    },
    {
        rules:{
            "@typescript-eslint/no-unused-vars": "warn", // Duplicate
            "no-unused-vars": "warn",
            "semi":"error",
            "no-empty": "warn"
        },
    },
]);
