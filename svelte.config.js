import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import {mdsvex} from 'mdsvex';
import {join} from 'path';

const layoutPath = join(import.meta.dirname,'src/lib/components/BlogLayout.svelte')

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md','.svx'],
	layout: layoutPath,
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.md','.svelte','.svx'],
	preprocess: [vitePreprocess(),mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter()
	}
};

export default config;
