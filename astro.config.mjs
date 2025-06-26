// @ts-check
/* global process */
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
import {loadEnv} from "vite";

const {DEV} = loadEnv(process.env.NODE_ENV,process.cwd(),"");

export default defineConfig({
    site: "https://wakunguma.com",
    output: "server",
    prefetch: true,
    markdown: {
        shikiConfig: {
            themes: {
                light: "everforest-light",
                dark: "everforest-dark"
            }
        }
    },
    integrations: [
        svelte(),
        mdx(),
        sitemap()
    ],
    vite: {
        plugins: [
            tailwindcss()
        ]
    },
    adapter: node({
      mode: "standalone"
    })
});
