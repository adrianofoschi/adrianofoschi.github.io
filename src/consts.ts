// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Adriano Foschi';
export const SITE_DESCRIPTION =
	"Projects, experiments and lessons from 20+ years of building software — what I've built, and what I'm building now.";

export const AUTHOR = {
	name: 'Adriano Foschi',
	// Used for the Person entity in structured data.
	url: 'https://adrianofoschi.com/about',
	github: 'https://github.com/adrianofoschi',
	cv: 'https://rxresu.me/adrianofoschi/cv',
	linkedin: 'https://www.linkedin.com/in/adrianofoschi/',
	x: 'https://x.com/adrihoke',
	/** Handle form, for the `twitter:` card attribution meta. */
	xHandle: '@adrihoke',
} as const;

/**
 * `sameAs` for the Person entity — the profiles that let a search or answer engine resolve
 * this site to the same person it has seen elsewhere. Off-site presence is what that
 * resolution rests on, so every genuine profile added here helps.
 *
 * Only list accounts that are real and maintained: a `sameAs` pointing at an abandoned
 * profile weakens the entity instead of strengthening it.
 */
export const AUTHOR_PROFILES = [
	AUTHOR.github,
	AUTHOR.linkedin,
	AUTHOR.x,
	AUTHOR.cv,
] as const;

/** Social preview image (never rendered on the page — only for link unfurls and crawlers). */
export const OG_IMAGE = '/og.png';

/**
 * Content licence. Stated in three places that must agree: the footer (for people), the
 * `license` property in the structured data, and `public/license.xml` in RSL form (for
 * crawlers, discovered via the `License:` directive in `public/robots.txt`).
 */
export const LICENSE = {
	url: 'https://creativecommons.org/licenses/by/4.0/',
	label: 'CC BY 4.0',
} as const;

/**
 * Closed tag vocabulary, with the label and the description used on the tag pages.
 *
 * Deliberately small: every tag must cover at least two posts, because a tag page with a
 * single article is a thin page. Tags exist mainly to give the site the internal linking it
 * otherwise lacks — posts never cross-reference each other by editorial rule.
 */
export const TAGS = {
	blockchain: {
		label: 'blockchain',
		description:
			'Smart contracts, wallets and protocol work, all of it on the Koinos chain: what the platform made easy, and what it made hard.',
	},
	wallets: {
		label: 'wallets',
		description:
			'Building wallets people actually hold money in — local state, migrations with no undo, seed phrases and the attempts to get rid of them.',
	},
	architecture: {
		label: 'architecture',
		description:
			'Boundaries, ports and adapters, and the difference between an architecture written in a document and one a machine can check.',
	},
	ai: {
		label: 'AI',
		description:
			'Working with AI coding agents as a systems problem: explicit standards, blocking gates, and the cost of verifying what gets produced.',
	},
	career: {
		label: 'career',
		description:
			'What the working years taught that no course did — clients, consulting, product, and where quality does and does not come from.',
	},
	homelab: {
		label: 'homelab',
		description:
			'Running my own infrastructure at home, for its own sake: hardware soldered by hand, devices freed from their manufacturer, and everything answering to a machine of mine.',
	},
	'early-projects': {
		label: 'early projects',
		description:
			'How it started: game modding as a teenager, software a school ran on, and a university thesis with an inconvenient result.',
	},
} as const;

export type TagName = keyof typeof TAGS;

/** Tuple form, for the zod enum in the content schema. */
export const TAG_NAMES = Object.keys(TAGS) as [TagName, ...TagName[]];
