import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/**
 * Flattens a hero (still or video-with-poster) to the one thing every surface that isn't the
 * post page itself needs: a single built image URL, for the social card, the JSON-LD `image`,
 * and a `<video poster>` attribute. `<video poster>` takes a plain src string, not the
 * `<Image>` component, which is why this goes through `getImage()` rather than rendering
 * `<Image>` and reading its output.
 */
export async function heroPosterURL(source: ImageMetadata): Promise<string> {
	const built = await getImage({ src: source, width: 1200, height: 600, format: 'webp' });
	return built.src;
}
