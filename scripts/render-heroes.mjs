import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { D2 } from '@terrastruct/d2';

const BLOG_ASSETS = 'src/assets/blog';
/** The hero frame is 2:1. Rendering at exactly this size means nothing is ever cropped. */
const WIDTH = 1200;
const HEIGHT = 600;

/**
 * Renders every `hero.d2` under `src/assets/blog/<post>/` to the `hero.png` beside it.
 *
 * Run with `npm run heroes` after editing a hero source. Both files are committed: unlike
 * `public/d2/`, the PNG cannot be generated during the build.
 *
 * Why not rasterize with sharp, which is already a dependency: D2 embeds its fonts in the SVG
 * as `@font-face` rules, and librsvg — what sharp uses for SVG input — ignores `@font-face`
 * entirely. The output came out in a fallback sans, which is the one thing a hero must not be
 * on a site where every diagram is IBM Plex Mono. A browser honours the embedded font, so the
 * SVG is screenshotted instead.
 *
 * Why a raster at all, rather than serving the SVG: Astro's image pipeline refuses SVG sources
 * without `dangerouslyProcessSVG`, and a social card has to be a raster for crawlers to use it.
 */
// A plain number array, not a Uint8Array: that is what the D2 WebAssembly bridge accepts,
// and passing a typed array silently produces a diagram set in a fallback sans instead.
const font = (file) => [...fs.readFileSync(path.join('fonts', file))];

const sources = fs
	.readdirSync(BLOG_ASSETS, { withFileTypes: true })
	.filter((e) => e.isDirectory())
	.map((e) => path.join(BLOG_ASSETS, e.name, 'hero.d2'))
	.filter((p) => fs.existsSync(p));

if (sources.length === 0) {
	console.log('no hero.d2 sources found');
	process.exit(0);
}

const chrome =
	process.env.CHROME_PATH ??
	['google-chrome', 'chromium', 'chromium-browser'].find((c) => {
		try {
			execFileSync('which', [c], { stdio: 'pipe' });
			return true;
		} catch {
			return false;
		}
	});

if (!chrome) {
	console.error('no Chrome found; set CHROME_PATH to render hero diagrams');
	process.exit(1);
}

const d2 = new D2();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'heroes-'));

for (const source of sources) {
	const out = source.replace(/\.d2$/, '.png');
	// The request form, matching how astro-d2 drives the same WebAssembly build. The string
	// overload silently drops the font options and renders the diagram in a fallback sans.
	const compiled = await d2.compile({
		fs: { index: fs.readFileSync(source, 'utf-8') },
		inputPath: 'index',
		options: {
			layout: 'dagre',
			themeID: 0,
			pad: 40,
			fontRegular: font('IBMPlexMono-Regular.ttf'),
			fontBold: font('IBMPlexMono-Bold.ttf'),
			fontItalic: font('IBMPlexMono-Italic.ttf'),
			fontSemibold: font('IBMPlexMono-SemiBold.ttf'),
		},
	});
	const svg = await d2.render(compiled.diagram, compiled.renderOptions);

	// The diagram is fitted inside the frame rather than cropped to it, so a source doesn't
	// have to be authored at exactly 2:1 to survive — though the closer it is, the better it
	// fills the banner.
	const page = path.join(tmp, 'page.html');
	fs.writeFileSync(
		page,
		`<!doctype html><meta charset="utf-8">
<style>
 html,body{margin:0;padding:0;background:#fff}
 body{width:${WIDTH}px;height:${HEIGHT}px;display:flex;align-items:center;justify-content:center}
 svg{max-width:96%;max-height:92%;height:auto;width:auto}
</style>
${svg}`,
	);

	execFileSync(chrome, [
		'--headless',
		'--disable-gpu',
		'--hide-scrollbars',
		`--window-size=${WIDTH},${HEIGHT}`,
		`--screenshot=${path.resolve(out)}`,
		'--virtual-time-budget=4000',
		`file://${path.resolve(page)}`,
	]);
	console.log(`rendered ${out}`);
}

fs.rmSync(tmp, { recursive: true, force: true });

// The D2 WebAssembly worker keeps the event loop alive, so the process needs telling.
process.exit(0);
