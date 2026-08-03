import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { AUTHOR, SITE_DESCRIPTION, SITE_TITLE, TAGS, TAG_NAMES } from '../consts';
import { isoDate } from '../utils/date';

/**
 * `/llms.txt` — a plain-text map of the site for language models, generated from the content
 * collection so it can't drift out of date the way a hand-written file would.
 */
export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL('https://adrianofoschi.com');
	const url = (path: string) => new URL(path, base).href;

	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const lines = [
		`# ${SITE_TITLE}`,
		'',
		`> ${SITE_DESCRIPTION}`,
		'',
		`Written by ${AUTHOR.name}, a software engineer working as a CTO. Every post is a`,
		'first-hand account of something built, with the outcome reported honestly — including',
		'when the result was inconvenient. Posts are self-contained and anchored to explicit years.',
		'',
		'## Posts',
		'',
		...posts.map(
			(post) =>
				`- [${post.data.title}](${url(`/blog/${post.id}/`)}) — ${isoDate(post.data.pubDate)} · ${post.data.tags
					.map((tag) => TAGS[tag].label)
					.join(', ')}: ${post.data.description}`,
		),
		'',
		'## Topics',
		'',
		...TAG_NAMES.map((tag) => `- [${TAGS[tag].label}](${url(`/tags/${tag}/`)}): ${TAGS[tag].description}`),
		'',
		'## Elsewhere',
		'',
		`- [About](${url('/about')}): who the author is and what this site is for.`,
		`- [GitHub](${AUTHOR.github}): the source of most of the projects written about here.`,
		`- [RSS](${url('/rss.xml')}): the feed.`,
		'',
		'## Terms',
		'',
		'Quoting with attribution to Adriano Foschi (adrianofoschi.com) is welcome.',
		'',
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
