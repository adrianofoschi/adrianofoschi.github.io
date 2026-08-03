# adrianofoschi.com

Personal blog for Adriano Foschi. Astro + Tailwind, deployed statically to GitHub Pages,
served on the custom domain `adrianofoschi.com` via Cloudflare DNS (DNS-only CNAME to
`adrianofoschi.github.io`, no proxy — required for GitHub's TLS cert to work).

**Repo identity**: this repo is `adrianofoschi/adrianofoschi.github.io` (the GitHub user
site — required name for GitHub Pages to serve at the domain root). It is a DIFFERENT
repo from `adrianofoschi/adrianofoschi`, which is only the GitHub profile README + CV
JSON files. Don't confuse the two.

## What this blog is (and isn't)

A record of what Adriano has built and is building — side projects, experiments,
lessons learned — spanning from self-taught teenage projects to his current work as a
CTO. It is explicitly **not** built around a single thesis or argument (an earlier plan
to frame the whole blog around "explicit standards make AI coding better" was dropped —
that's just one topic among many, not the blog's frame). Site language is English only.

## Editorial rules for any post (apply by default, don't wait to be asked)

1. **No cross-references between posts.** Never write "after [other post's subject], I…"
   or "that thread deserves its own post" or anything assuming the reader has read another
   specific post. Every post must stand alone. Anchor events in time with an **explicit
   year or year range** instead (e.g. "in 2006…", "from 2013 to 2015…").
2. **No personal provenance details.** No city names tied to Adriano's own history
   (hometown, schools, where he's lived/worked), no real names of private individuals
   (family, personal collaborators, teachers, clients) — use generic references instead
   ("my father", "a collaborator"). EXCEPTION: real names/nicknames of public figures
   cited as verifiable sources (e.g. named collaborators from a public community with
   documented credits) are fine when Adriano explicitly confirms it for that case.
3. **Only real images in the body.** Recover real screenshots/diagrams/photos (Wayback
   Machine, personal archives, a project's own repo) — never stock photos, never a
   fabricated UI. If nothing real survives, the post simply has no inline images.
4. **No hero images.** Posts open on the title; the home page is a list of titles and
   descriptions. Generated 1200×630 hero frames existed until Aug 2026 and were removed
   entirely — code, assets and generator script — because they weren't earning their place.
   Don't add a `heroImage` field back, and don't reintroduce a per-post header image
   without asking. Real images belong in the body, under rule 3.
5. **A cluster (topic) is not capped at one post.** Any topic can get more posts later as
   more material surfaces — don't treat a topic as "done" after one article.

The full editorial backlog, career timeline, and per-post sourcing notes live in
`notes/content-plan.md` — **gitignored, never published**. Read it before planning the
next post; update it after publishing one.

## Structure

- `src/content/blog/*.md` — posts. Frontmatter: `title`, `description`, `pubDate`
  (coerced to Date, e.g. `'Aug 6 2026'`), optional `updatedDate`. Nothing else.
- `src/assets/blog/<post-dir>/` — one folder per post, holding the real images used inline
  in that post. Posts with no surviving imagery have no folder at all.
- `src/pages/[...page].astro` — paginated home page (post list).
- `src/pages/about.astro` — About page.
- `src/components/`, `src/layouts/BlogPost.astro` — shared header/footer/link/layout.
- `src/styles/global.css` — theme: black background, IBM Plex Mono (Google font
  provider, configured in `astro.config.mjs`), cyan accent. Dark-only, no light mode.
- `.github/workflows/deploy.yml` — builds and deploys to GitHub Pages on every push to
  `main`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

To verify a change renders correctly, `npm run build` then `astro preview` — screenshot
with a headless browser if visual changes are involved (this project has no automated
visual tests).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
