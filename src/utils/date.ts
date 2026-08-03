/**
 * Formats a post date as a plain `YYYY-MM-DD` calendar date.
 *
 * Frontmatter dates are calendar days, not instants: `'Aug 26 2026'` is parsed as local
 * midnight, so `toISOString()` shifts it back a day in any timezone east of UTC. Machine-readable
 * dates (structured data, Open Graph, `<time datetime>`, llms.txt) therefore use the local
 * calendar components rather than an instant, which is also the form schema.org expects.
 */
export function isoDate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}
