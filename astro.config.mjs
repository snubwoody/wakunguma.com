// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    site: 'https://wakunguma.com',
	integrations: [
        svelte(),
        mdx(), 
        sitemap(),
    ],
    vite:{
        plugins:[
            tailwindcss()
        ]
    }
});
