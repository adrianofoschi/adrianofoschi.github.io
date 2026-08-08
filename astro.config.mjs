// @ts-check

import fs from 'node:fs';
import path from 'node:path';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import astroD2 from 'astro-d2';

import tailwindcss from '@tailwindcss/vite';

/**
 * Post URL -> last modified calendar day, for the sitemap's `lastmod`.
 *
 * The frontmatter is read straight off disk rather than through the content collection,
 * because an integration is configured before `astro:content` is available. Dates are
 * formatted from local calendar components, never `toISOString()`: a frontmatter date is a
 * calendar day parsed as local midnight, and an instant shifts it back a day east of UTC.
 */
const postLastmod = new Map(
	fs
		.readdirSync('src/content/blog')
		.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
		.map((file) => {
			const source = fs.readFileSync(path.join('src/content/blog', file), 'utf-8');
			const read = (field) => source.match(new RegExp(`^${field}:\\s*['"]?(.+?)['"]?\\s*$`, 'm'))?.[1];
			const date = new Date(read('updatedDate') ?? read('pubDate'));
			const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			return [`https://adrianofoschi.com/blog/${file.replace(/\.mdx?$/, '')}/`, day];
		}),
);

/** The newest post, used as `lastmod` for the listing pages that change whenever one lands. */
const newestPost = [...postLastmod.values()].sort().at(-1);

// https://astro.build/config
export default defineConfig({
	site: 'https://adrianofoschi.com',
	integrations: [
		mdx(),
		sitemap({
			// Without `lastmod` a crawler has no way to tell which of 31 URLs is worth
			// re-fetching. Posts carry their own date; the lists carry the newest post's.
			serialize: (item) => ({
				...item,
				lastmod: postLastmod.get(item.url) ?? newestPost,
			}),
		}),
		astroD2({
			// The site is light-only, so diagrams render with the neutral light theme
			// and there is no dark variant to switch to.
			theme: { default: '0', dark: false },
			pad: 20,
			// Diagrams belong to the site's monospace voice, alongside code and
			// metadata — not to the sans used for prose. Vendored under fonts/ (OFL).
			fonts: {
				regular: 'fonts/IBMPlexMono-Regular.ttf',
				bold: 'fonts/IBMPlexMono-Bold.ttf',
				italic: 'fonts/IBMPlexMono-Italic.ttf',
				semibold: 'fonts/IBMPlexMono-SemiBold.ttf',
			},
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
		// Prose is IBM Plex Sans and everything that reads as machine output —
		// nav, dates, tags, code, diagrams — is IBM Plex Mono. Same superfamily,
		// so the two never look like a pairing of strangers.
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Sans',
			cssVariable: '--font-sans',
			weights: [400, 600, 700],
			styles: ['normal', 'italic'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
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
