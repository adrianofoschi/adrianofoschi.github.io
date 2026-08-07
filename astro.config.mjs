// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import astroD2 from 'astro-d2';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://adrianofoschi.com',
	integrations: [
		mdx(),
		sitemap(),
		astroD2({
			// The site is light-only, so diagrams render with the neutral light theme
			// and there is no dark variant to switch to.
			theme: { default: '0', dark: false },
			pad: 20,
			// WebAssembly generation, so the build needs no `d2` binary — and the
			// GitHub Pages workflow stays as it is.
			experimental: { useD2js: true },
		}),
	],

	markdown: {
		// Astro defaults to a dark syntax theme, which no longer matches the page.
		shikiConfig: { theme: 'github-light' },
	},

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
