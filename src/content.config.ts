import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TAG_NAMES } from './consts';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Closed vocabulary — see TAGS in src/consts.ts. Keeping it closed is deliberate:
			// a tag page with a single post is a thin page, so new tags are added only when at
			// least two posts genuinely share the topic.
			tags: z.array(z.enum(TAG_NAMES)).nonempty(),
			// Required, so a post cannot ship without one. It must be about *this* post —
			// a recovered artefact or a diagram of something the post describes, never a
			// decorative image. See editorial rule 4.
			heroImage: image(),
			// Alt text for the hero, which is content and not decoration, so it is never empty.
			heroAlt: z.string().min(1),
		}),
});

export const collections = { blog };
