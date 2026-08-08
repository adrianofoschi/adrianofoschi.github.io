import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, render } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

/**
 * Rewrites root-relative URLs to absolute ones.
 *
 * A feed is read somewhere else entirely, so `/d2/…` and `/_astro/…` resolve against the
 * reader's host and break. Only `/`-rooted values are touched: `//host` is already absolute
 * and must be left alone.
 */
function absolutize(html, site) {
	return html.replace(
		/(\s(?:src|href|poster)=")\/(?!\/)/g,
		(_, attr) => `${attr}${new URL('/', site).href}`,
	);
}

export async function GET(context) {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	// The container renders the post the way a page does, which is what resolves the image
	// placeholders that sit in `entry.rendered.html`. Reading the rendered HTML directly is
	// tempting and produces `<img __ASTRO_IMAGE_="…">` in the feed.
	const container = await AstroContainer.create();

	const items = await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			const html = await container.renderToString(Content);
			return {
				...post.data,
				link: `/blog/${post.id}/`,
				categories: post.data.tags,
				content: absolutize(html, context.site),
			};
		}),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
		customData: [
			'<language>en</language>',
			// Tells an aggregator where the feed canonically lives, so a copy of it can still
			// be traced back here.
			`<atom:link href="${new URL('rss.xml', context.site).href}" rel="self" type="application/rss+xml"/>`,
		].join(''),
		items,
	});
}
