// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';

import vercel from '@astrojs/vercel';

export default defineConfig({
    site: 'https://wakunguma.com',
    prefetch: true,
    markdown:{
        shikiConfig:{
            themes: {
                light: 'everforest-light',
                dark: 'everforest-dark'
            },
        },
    },
    integrations: [
        svelte(),
        mdx(), 
        sitemap(),
    ],
    vite:{
        plugins:[
            tailwindcss()
        ]
    },
    adapter: vercel()
});
