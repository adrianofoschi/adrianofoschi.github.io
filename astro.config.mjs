// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://adrianofoschi.com',
	integrations: [mdx(), sitemap()],

	fonts: [
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-mono',
			weights: [400, 500, 700],
			styles: ['normal', 'italic'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
