#!/usr/bin/env node
/**
 * Generates every post's hero image at one uniform size (1200x630) on the site theme.
 *
 * Two kinds of hero, one visual language:
 *   - `sources`: real screenshots laid out in a row, contain-fit, never cropped.
 *   - `quote`:   a typographic card, for posts where no real image survives.
 *
 * Both carry the same bottom caption (accent tick + project · years).
 *
 * Run with: node scripts/generate-heroes.mjs
 * Needs ImageMagick (`magick`) and IBM Plex Mono in .cache/fonts (auto-downloaded).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'src/assets/blog');
const FONTS = join(ROOT, '.cache/fonts');

// Canvas and theme — mirrors src/styles/global.css.
const W = 1200;
const H = 630;
const BG = '#0a0a0a';
const FG = '#e5e5e5';
const MUTED = '#737373';
const BORDER = '#262626';
const ACCENT = '#22d3ee';

// Inner box the artwork gets to occupy, leaving room for the caption line.
const PAD_X = 56;
const BOX_TOP = 52;
const BOX_H = 462;
const BOX_W = W - PAD_X * 2;
const GAP = 24;
const CAPTION_Y = 566;

const font = (weight) => join(FONTS, `IBMPlexMono-${weight}.ttf`);

const WEIGHTS = ['Regular', 'Medium', 'SemiBold', 'Bold'];
if (WEIGHTS.some((w) => !existsSync(font(w)))) {
	// IBM Plex Mono is loaded from Google's font provider at build time, so it is not
	// vendored in the repo. Fetch it once into a gitignored cache.
	console.log('fetching IBM Plex Mono into .cache/fonts …');
	mkdirSync(FONTS, { recursive: true });
	const zip = join(FONTS, 'plex.zip');
	execFileSync('curl', [
		'-sL', '-o', zip,
		'https://github.com/IBM/plex/releases/download/%40ibm%2Fplex-mono%401.1.0/ibm-plex-mono.zip',
	]);
	execFileSync('unzip', ['-o', '-j', '-q', zip, ...WEIGHTS.map((w) => `ibm-plex-mono/fonts/complete/ttf/IBMPlexMono-${w}.ttf`), '-d', FONTS]);
}

const POSTS = [
	{
		slug: 'fifa-modding-at-14',
		dir: 'fifa-modding',
		caption: 'footballmatch.it · 2001–2005',
		sources: ['face-importer.jpg', 'olimpico-lazio.jpg'],
	},
	{
		slug: 'school-software-at-16',
		dir: 'school-software',
		caption: 'Scrutini · GeCo · Ambito5 · 2006',
		quote:
			'A 16-year-old had just been handed the software that would produce every student’s official grades.',
	},
	{
		slug: 'freelance-years',
		dir: 'freelance-years',
		caption: 'freelance · 2013–2015',
		quote:
			'Technical skill gets you in the room, but it’s not what keeps a client relationship working.',
	},
	{
		slug: 'big-data-thesis',
		dir: 'uniba-thesis',
		caption: 'Hive vs. MySQL benchmark · 2012',
		sources: ['star-schema.png'],
	},
	{
		slug: 'konio-mobile-wallet',
		dir: 'konio-wallet',
		caption: 'Konio · 2023',
		sources: ['balance-screen.png', 'send-screen.png'],
	},
	{
		slug: 'konio-migration-and-growth',
		dir: 'konio-growth',
		caption: 'Konio · 2023–2024',
		sources: ['nft-autotracking-cover.png'],
	},
	{
		slug: 'veive-smart-accounts',
		dir: 'veive',
		caption: 'Veive · 2024',
		// The full docs page is 1280x1397 — the top half stays legible at hero scale.
		sources: [{ file: 'docs-site.png', crop: '1280x700+0+0' }],
	},
	{
		slug: 'sovrano-wallet',
		dir: 'sovrano',
		caption: 'Sovrano · 2024–2025',
		// security-key.png is a video still — crop the player control bar off the bottom.
		sources: ['signup-passkey.png', { file: 'security-key.png', crop: '800x370+0+0' }],
	},
	{
		slug: 'onchain-signature-verifiers',
		dir: 'verifiers',
		caption: 'verifier-p256 · verifier-rsa · 2024',
		sources: ['p256-verify-flow.png'],
	},
	{
		slug: 'blockchain-cant-tell-the-time',
		dir: 'kuku',
		caption: 'Kuku Games · 2025',
		sources: ['prediction-screens.png'],
	},
	{
		slug: 'wallet-in-a-chat-app',
		dir: 'telegram-wallet',
		caption: 'Sovrano Telegram bot · 2025',
		quote:
			'The bot could not be a wallet. It could only be a remote control for one.',
	},
];

const magick = (args) => execFileSync('magick', args, { encoding: 'buffer' });
const identify = (file) =>
	execFileSync('magick', ['identify', '-format', '%w %h', file], { encoding: 'utf8' })
		.split(' ')
		.map(Number);

/** Scale a row of images to a common height so the row fits the inner box. */
function layout(sizes) {
	let h = BOX_H;
	const width = (height) =>
		sizes.reduce((sum, [w, hh]) => sum + Math.round((w / hh) * height), 0) +
		GAP * (sizes.length - 1);
	if (width(h) > BOX_W) h = Math.floor((h * BOX_W) / width(h));
	const boxes = sizes.map(([w, hh]) => [Math.round((w / hh) * h), h]);
	const total = boxes.reduce((sum, [w]) => sum + w, 0) + GAP * (boxes.length - 1);
	let x = Math.round(PAD_X + (BOX_W - total) / 2);
	return boxes.map(([w, hh]) => {
		const box = { w, h: hh, x, y: Math.round(BOX_TOP + (BOX_H - hh) / 2) };
		x += w + GAP;
		return box;
	});
}

/** Shared chrome: background, accent tick, caption. */
function chrome(caption) {
	return [
		'-size', `${W}x${H}`, `xc:${BG}`,
		'-fill', ACCENT, '-draw', `rectangle ${PAD_X},${CAPTION_Y - 12} ${PAD_X + 3},${CAPTION_Y + 6}`,
		'-font', font('Regular'), '-pointsize', '19', '-fill', MUTED,
		'-annotate', `+${PAD_X + 18}+${CAPTION_Y + 6}`, caption,
	];
}

function buildSources(post, out) {
	const items = post.sources.map((s) => (typeof s === 'string' ? { file: s } : s));
	const files = items.map((it) => join(ASSETS, post.dir, it.file));
	const sizes = items.map((it, i) =>
		it.crop ? it.crop.split('+')[0].split('x').map(Number) : identify(files[i]),
	);
	const boxes = layout(sizes);
	const args = chrome(post.caption);
	items.forEach((it, i) => {
		const { w, h, x, y } = boxes[i];
		args.push('(', files[i]);
		if (it.crop) args.push('-crop', it.crop, '+repage');
		args.push(
			'-resize', `${w}x${h}!`, '-bordercolor', BORDER, '-border', '1', ')',
			'-gravity', 'northwest', '-geometry', `+${x - 1}+${y - 1}`, '-composite',
		);
	});
	args.push(out);
	magick(args);
}

const QUOTE_SIZE = 38;
const RULE_GAP = 46;

function buildQuote(post, out) {
	const text = [
		'-background', 'none', '-fill', FG,
		'-font', font('Medium'), '-pointsize', String(QUOTE_SIZE), '-interline-spacing', '18',
		'-size', `${BOX_W - 40}x`, `caption:${post.quote}`,
	];
	// Measure the wrapped block so rule + quote sit centred in the box as one unit.
	const [, textH] = execFileSync('magick', [...text, '-format', '%w %h', 'info:'], {
		encoding: 'utf8',
	})
		.split(' ')
		.map(Number);
	const top = Math.round(BOX_TOP + (BOX_H - (textH + RULE_GAP)) / 2);
	magick([
		...chrome(post.caption),
		'-fill', ACCENT, '-draw', `rectangle ${PAD_X},${top} ${PAD_X + 64},${top + 3}`,
		'(', ...text, ')',
		'-gravity', 'northwest', '-geometry', `+${PAD_X}+${top + RULE_GAP}`, '-composite',
		out,
	]);
}

for (const post of POSTS) {
	const dir = join(ASSETS, post.dir);
	mkdirSync(dir, { recursive: true });
	const out = join(dir, 'hero.png');
	if (post.sources) buildSources(post, out);
	else buildQuote(post, out);
	console.log(`${post.slug} → ${out.replace(ROOT + '/', '')}`);
}
