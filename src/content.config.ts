import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TAG_NAMES } from './consts';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				description: z.string(),
				// Transform string to Date object
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				// Closed vocabulary — see TAGS in src/consts.ts. Keeping it closed is deliberate:
				// a tag page with a single post is a thin page, so new tags are added only when at
				// least two posts genuinely share the topic.
				tags: z.array(z.enum(TAG_NAMES)).nonempty(),
				// A hero is either a still image, or a video with a still standing in for it
				// wherever a video cannot go: the social card, JSON-LD, and the RSS feed. Video
				// is a plain file under public/ rather than an image() — it isn't run through
				// the image pipeline, just served as-is — so it's referenced by root URL.
				heroImage: image().optional(),
				heroVideo: z
					.string()
					.startsWith('/videos/blog/', 'heroVideo must point into /videos/blog/')
					.optional(),
				heroPoster: image().optional(),
				// The hero is content, not decoration, so its alt text is never empty. It also
				// labels the <video> when the hero is one.
				heroAlt: z.string().min(1),
			})
			.refine((post) => post.heroImage ?? (post.heroVideo && post.heroPoster), {
				message: 'a post needs heroImage, or heroVideo together with heroPoster',
			}),
});

export const collections = { blog };
