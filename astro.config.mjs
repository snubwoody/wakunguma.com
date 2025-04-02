// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcs from '@tailwindcss/vite'



// https://astro.build/config
export default defineConfig({
	vite:{
		plugins:[tailwindcs()]
	}
});
