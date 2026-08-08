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
   Explanatory **diagrams are the one thing you may author**, because a diagram claims to
   explain rather than to be a recovered artifact — but only from something real (the
   project's own docs or source), never from a mechanism you assumed. **A diagram stops
   where the post stops**: if the text doesn't say who broadcasts the transaction, the
   diagram doesn't either — the gap is the honest output, not something to fill in. Write
   them as D2, see Structure below.
4. **Every post has a hero, and the hero is about that post.** Generated 1200×630 frames
   existed until Aug 2026 and were removed for being generic; heroes came back later the
   same month on the opposite terms. A hero is a recovered artefact, a diagram of
   something the post describes, or a video of the thing itself — the same bar rule 3 sets
   for the body. Never a stock image, never something decorative that could sit on any
   post, and **not too many diagrams**: fifteen of the first twenty heroes were diagrams,
   which read as the fallback whenever no photograph existed rather than a real choice —
   reach for a diagram only once a real photo or video has been ruled out. The frame is 2:1
   and the image is cropped to fill, so compose for that shape. `heroAlt` is **required by
   the schema** because a hero is content, so it is never empty. The hero is also the
   post's social card and its thumbnail in the listings.
   - **A still image**: `heroImage`, an `image()` field, cropped or composed to 2:1.
   - **A video**: `heroVideo` (a root-relative path into `public/videos/blog/`, since
     video is served as a plain static file rather than run through the image pipeline)
     together with `heroPoster` (an `image()` field — a representative still, needed
     because a video cannot serve as the social card, the JSON-LD `image`, or an RSS
     enclosure). On the post page the video plays, with controls and no autoplay, the same
     restraint already used for the YouTube embeds inline in some posts. In the listings
     and tag pages it renders as a `<video>` too, muted/loop/no-controls/`preload="none"` —
     which behaves exactly like a still (the browser shows the poster and fetches nothing
     else) while remaining literally a video. Exactly one of `heroImage` or
     `heroVideo`+`heroPoster` must be set; the schema's `.refine()` enforces it.
   - **Diagram heroes** are written as `src/assets/blog/<dir>/hero.d2` and rendered with
     `npm run heroes` (Chrome headless, not `sharp` — see the script's own comment for why).
     Both the source and the PNG are committed. Author them **wide**: the frame is 2:1, and
     a diagram laid out tall is fitted with large empty margins either side. Don't fight
     for every diagram to fill the frame exactly — a wide, short diagram centred in the 2:1
     frame with margin top and bottom is fine as it is.
   - Where the only candidate is an image already used in the body, promote it and remove
     the inline copy rather than showing the same picture twice.
5. **A cluster (topic) is not capped at one post.** Any topic can get more posts later as
   more material surfaces — don't treat a topic as "done" after one article.
6. **Every post has section headings, and a heading says what its section establishes.**
   No post is a wall of text; two were until Aug 2026 and it was the worst structural
   defect on the site. A bare noun is not a heading — "Tasmota", "Mana", "GeCo" tell a
   reader who hasn't already read the paragraph nothing at all. Phrase a heading as a
   **question only where the section genuinely answers that question**; converting them
   wholesale reads as SEO filler, which is the failure this rule exists to avoid.
   Narrative beats may stay declarative.
7. **Keep a section under ~350 words**, ideally 100–250. Long sections aren't bad writing
   — they happen when an argument is continuous — but they are the unit a reader scans and
   an extractive system lifts. Split with an `###` at a turn the argument already makes,
   and **don't rewrite the prose to fit**: if there's no genuine turn, leave it long.
8. **Name a source, link the source.** Any product, paper, tool or service a post names
   gets a link on first mention — Zanzibar, OpenFGA, `dependency-cruiser`, Hive. **Check
   the URL resolves before adding it.** This is the cheapest attribution there is and five
   posts were missing it until Aug 2026.
9. **A definition must survive being lifted out of the paragraph around it.** Where a post
   defines something, name the term and state what it is, without a pronoun reaching back
   into the sentence before: "Obrussa is a public repository of standards…", not "Obrussa
   is what I call the repository where all of this lives".
10. **Tables only for comparisons that are measured, not argued.** A benchmark or two
    things set side by side belongs in a table. A contrast that is being *reasoned about*
    doesn't — a table there duplicates the prose instead of condensing it.

The full editorial backlog, career timeline, and per-post sourcing notes live in
`notes/content-plan.md` — **gitignored, never published**. Read it before planning the
next post; update it after publishing one. `notes/GEO-ANALYSIS.md`, also gitignored, is
the standing SEO/GEO audit with the current score and what was deliberately not done.

## Structure

- `src/content/blog/*.md` — posts. Frontmatter: `title`, `description`, `pubDate`
  (coerced to Date, e.g. `'Aug 6 2026'`), `tags` (at least one), optional `updatedDate`.
- **`pubDate` is not today's date.** The blog is backdated to read as an archive kept
  regularly since 2023. A post written in the contemporaneous voice is pinned to the period
  it narrates — that date is a fact, and the narrator may not know anything that happened
  after it, including his own later job titles. A retrospective post can be placed anywhere,
  and is placed to keep the cadence even. Decide the voice first, then the date, and check
  the timeline table in `notes/content-plan.md` before picking one. `updatedDate` is only
  for a genuine update *after* a post's own date, not for a rewrite — a "revised in 2026"
  stamp on a post dated 2023 gives the backdating away.
- **Tags are a closed vocabulary**, defined with their labels and descriptions in
  `src/consts.ts` (`TAGS`) and enforced by the content schema — an unknown tag fails the
  build. Every tag must cover **at least two posts**: a tag page with one post is a thin
  page. Adding a tag means editing `TAGS`, and only when two posts genuinely share the topic.
  Tags are also the site's only internal linking, since rule 1 forbids posts referring to
  each other — that's what they're for, not decoration.
- `src/pages/tags/[tag].astro`, `src/pages/tags/index.astro` — per-tag lists and the topics
  index, both generated from the vocabulary.
- SEO/machine-readable surface, all handled centrally in `src/components/BaseHead.astro`:
  canonical, Open Graph (`article` on posts, `website` elsewhere), Twitter card, and JSON-LD
  (`BlogPosting` with author/dates/keywords on posts, `WebSite` elsewhere). The social image
  is `public/og.png`, a single generated card — it never appears on a page. `public/robots.txt`
  allows the AI search crawlers explicitly and points at the sitemap; `src/pages/llms.txt.ts`
  generates `/llms.txt` from the collection, so it can't go stale. The `Person` entity's
  `sameAs` comes from `AUTHOR_PROFILES` in `src/consts.ts` — add real, maintained profiles
  there and nowhere else; off-site presence is what lets an answer engine resolve the entity.
- **The content licence is CC BY 4.0, and it is stated in four places that must agree**:
  the footer (for people), `license` in the JSON-LD and `<link rel="license">` (for search),
  and `public/license.xml` in RSL 1.0 form for AI crawlers, found through the global
  `License:` directive at the top of `public/robots.txt`. `LICENSE` in `src/consts.ts` is the
  source for the first three. The footer said "All rights reserved" until Aug 2026 — do not
  put that back, it contradicts the terms a crawler now reads.
- **The RSS feed carries the full post**, rendered through the container API in
  `src/pages/rss.xml.js`. Do not "simplify" it to `entry.rendered.html`: that string still
  holds unresolved `__ASTRO_IMAGE_` placeholders and would publish them into the feed. Feed
  URLs are rewritten to absolute, because a feed is read on someone else's host.
- **The sitemap's `lastmod` is built in `astro.config.mjs`**, not from the content collection:
  an integration is configured before `astro:content` exists, so the frontmatter is read off
  disk there. Posts get their own `updatedDate ?? pubDate`; listing pages get the newest post's.
- **Heading structure is part of the SEO surface, not just styling.** Exactly one `<h1>` per
  page, and no heading above it: the site brand in `Header.astro` is a `<span>` precisely
  because being an `<h2>` put an out-of-order heading ahead of every post's `<h1>`. The home
  page's `<h1>` is `sr-only` — it's a bare list by design — and post titles in the list are
  `<h2>`.
- **Umami is the only third-party request the site makes**, declared in `BaseHead.astro` and
  therefore present on every page. It needs `is:inline`, or Astro tries to bundle a script that
  has to stay a request to `cloud.umami.is` to work. It is cookieless, which is why there is no
  consent banner; adding anything else that phones out is a decision worth taking deliberately,
  on a site whose posts are partly about not routing through other people's clouds.
- Machine-readable dates use `isoDate()` from `src/utils/date.ts`, never `toISOString()`:
  frontmatter dates are calendar days parsed as local midnight, so an instant shifts them a
  day backwards in any timezone east of UTC.
- `src/assets/blog/<post-dir>/` — one folder per post, holding the real images used inline
  in that post. Posts with no surviving imagery have no folder at all.
- `src/pages/[...page].astro` — paginated home page (post list).
- `src/pages/about.astro` — About page.
- `src/components/`, `src/layouts/BlogPost.astro` — shared header/footer/link/layout.
- `src/styles/global.css` — theme: white background, dark cyan accent. **Light-only, no dark
  mode** (it was dark-only until Aug 2026). Six semantic tokens drive everything and components
  use them by name (`text-fg`, `text-muted`, `border-border`, `text-accent`), so never hardcode
  a colour in a component. The accent is `#0e7490`, not the brighter `#22d3ee`, which fails
  contrast against white.
- **Two typefaces, and the split carries meaning.** IBM Plex Sans is the site's voice —
  prose, titles, and the chrome around them (header, nav, footer). IBM Plex Mono is reserved
  for **data and labels**: dates, tags, inline code and code blocks, D2 diagrams. The rule is
  not "chrome vs content", it's "written by a person vs emitted by a machine" — the nav is
  writing, a timestamp is not. Same superfamily, so they never read as a pairing of strangers.
  Both come from the Google font provider, configured in `astro.config.mjs`; components pick
  the mono with Tailwind's `font-mono`, never a hardcoded family. Only the sans is preloaded
  in `BaseHead.astro` — `preload` emits a link per generated face, so preloading both families
  put sixteen font requests on the critical path. The site was monospace throughout until
  Aug 2026, and that change is why `BlogPost.astro` caps the prose measure at `68ch`: the sans
  fits far more characters per line, and the full column ran to nearly 90.
- **Diagrams are D2, written inline in the post** as a ` ```d2 ` block and rendered to SVG at
  build time by `astro-d2`. No PNG diagrams — the source belongs in the post, where it can be
  edited. Mermaid was considered and rejected: it needs a browser to draw, so it costs either
  ~1MB of JavaScript shipped to the reader or Chromium in CI. D2 runs as WebAssembly
  (`experimental.useD2js`), which is why the deploy workflow needs no extra step — keep it
  that way. **Always give the fence a `title="…"`** — `astro-d2` uses it as the image's `alt`,
  and it defaults to the useless `"Diagram"`. Describe what the diagram shows, since for a
  screen reader or an extractive crawler that sentence *is* the diagram. Diagrams stay in the
  site's monospace voice, using the IBM Plex Mono TTFs vendored
  in `fonts/` (OFL) — they are machine output, not prose, so they don't follow the body sans.
  Keep them
  narrow: width comes from label length and participant count, and anything past ~1100px
  reads small in the text column. Sizing is two CSS rules in `global.css`; a previous attempt
  to wrap diagrams in a `<figure>` via a rehype plugin was rejected as over-engineering.
  `public/d2/` is generated output and gitignored.
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
