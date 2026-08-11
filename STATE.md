# STATE

Dynamic status of this repo. Update after any meaningful change — infra, theme, or a new
post. For the editorial backlog (what's planned, sourcing notes per post), see
`notes/content-plan.md` (gitignored, not in this file).

## Infrastructure — done

- Astro 7 project, Tailwind v4 (`@tailwindcss/vite`), MDX + RSS + sitemap integrations.
- Repo split: this repo (`adrianofoschi/adrianofoschi.github.io`) hosts the site; the
  separate `adrianofoschi/adrianofoschi` repo holds only the GitHub profile README + CV
  JSON files.
- Deploy: GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to GitHub
  Pages on every push to `main`.
- Domain: `adrianofoschi.com`, DNS on Cloudflare (CNAME to `adrianofoschi.github.io`,
  DNS-only / no proxy), GitHub-issued TLS cert, HTTPS enforced.
- **Theme — light-only since Aug 2026.** It was dark-only (black background, cyan accent)
  from the first rewrite of the Astro starter until then. Now white background, `#171717`
  text, and a dark cyan `#0e7490` accent — the brighter `#22d3ee` failed contrast against
  white. Six semantic tokens in `src/styles/global.css` drive everything and components use
  them by name, so no component hardcodes a colour. **No dark mode at all.**
- **Two typefaces, and the split carries meaning (Aug 2026).** The site was IBM Plex Mono
  throughout until then. Now IBM Plex Sans is the voice — prose, titles, header, nav, footer —
  and IBM Plex Mono is reserved for data and labels: dates, tags, code, D2 diagrams. The rule
  is "written by a person vs emitted by a machine", not "chrome vs content". Both from the
  Google font provider; only the sans is preloaded, because `preload` emits a link per face
  and preloading both put sixteen font requests on the critical path. That change is also why
  `BlogPost.astro` caps the prose measure at `68ch` — the sans fits far more characters per
  line, and the full column ran to nearly 90.
- **Tags and the SEO surface (Aug 2026).** Posts carry `tags` from a **closed vocabulary**
  defined in `src/consts.ts` and enforced by the content schema. Currently six tags:
  `blockchain` (8), `architecture` (4), `career` (4), `early-projects` (4), `ai` (2),
  `homelab` (1). Deliberately broad, and every tag is meant to have at least two posts —
  single-post tag pages are thin pages (see **Next**: `homelab` is currently in breach).
  `wallets` was merged into `blockchain` in Aug 2026 — the two were the same cluster split in
  half. Tags render under each post title and in every list, with `/tags/<tag>/` pages. They
  exist to give the site internal linking, which it had none of, because the editorial rules
  forbid posts from referring to each other.
  Also done in the same pass: JSON-LD (`BlogPosting` with author, dates and keywords on posts,
  `WebSite` elsewhere); `og:type` fixed to `article` on posts; `twitter:title`/`description`/
  `image` added; `public/robots.txt` created, allowing GPTBot, OAI-SearchBot, ClaudeBot,
  PerplexityBot and friends explicitly and pointing at the sitemap; `/llms.txt` generated from
  the collection by `src/pages/llms.txt.ts`; and `public/og.png`, one generated 1200×630 card
  for link unfurls — which replaced `blog-placeholder-1.jpg`, an Astro-starter stock photo that
  had been serving as the social image for the entire site. All six template placeholder JPGs
  are gone.
  Second pass, same day, working through the `seo-geo` skill's rubric: the author is now a
  single `Person` entity with a stable `@id` at `/about#person`, referenced by every page
  instead of repeated as a string; `/about` is a `ProfilePage` with `jobTitle` and
  `knowsAbout`; the home page publishes `Blog` (with `blogPost`) and an `ItemList`; the RSS
  feed carries tags as categories and declares its language; and each post ends with a
  **Related reading** block (`src/components/RelatedPosts.astro`) — up to three posts ranked by
  shared tags, then recency. That block plus the tag pages mean every post is reachable from at
  least two other pages, which is the whole fix for a site whose editorial rules forbid posts
  from linking to each other in prose.
  **Deliberately not done**, with reasons recorded in `notes/GEO-ANALYSIS.md`: converting
  headings to question form, and adding FAQ blocks. Both trade the writing's voice for keyword
  shape, and the voice is what makes these posts worth reading. That report also names the real
  remaining gap, which is off-site: brand mentions correlate far more strongly with AI citation
  than anything on-page, and no amount of markup produces them.
- **Heroes: removed, then brought back on opposite terms (both Aug 2026).** The generated
  1200×630 typographic frames were deleted for being generic — they weren't earning their
  place. Heroes returned later the same month with a content bar instead of a decoration one: a
  hero must be a recovered artefact, a diagram of something the post describes, or a video of
  the thing itself, and `heroAlt` is **required by the schema** because a hero is content. The
  frame is 2:1, cropped to fill. **All 20 posts now carry one**: 19 use `heroImage`, and
  `veive-smart-accounts` uses `heroVideo` + `heroPoster` (a video can't serve as the social
  card, the JSON-LD `image`, or an RSS enclosure, so the poster is mandatory). Only two heroes
  are authored diagrams — `onchain/hero.d2` and `quality-loops/hero.d2`, rendered by
  `npm run heroes` — after fifteen of the first twenty were diagrams, which read as the
  fallback whenever no photograph existed. The hero doubles as the social card and the
  listing thumbnail.
- **One shell for every list of posts (Aug 2026).** `src/layouts/Listing.astro` renders the
  home page and each tag page identically: topic tabs (`TopicTabs.astro` — the whole vocabulary
  plus an "all" tab, plain links to pages that already exist, so switching topic is navigation
  and the site stays scriptless), the post list (`PostList.astro`), and a standing profile card
  (`Intro.astro` — square portrait, name, two sentences). Two columns from `lg` up with the card
  on the right; the card is **first in the document** and moved by `lg:order-last`, so a phone
  is introduced to the archive before it is listed. A tag page looking like the home page is
  what makes the tabs read as tabs, so the two must not drift apart.
  Removed in the same pass: `/tags` (the tabs *are* the list of topics, so a page repeating
  them was redundant) and the `topics` nav link. The nav is down to a single link, `about`, and
  the CV moved beside the social profiles as a two-letter mark — it was claimed in the `Person`
  entity's `sameAs` but linked from nowhere a crawler reads as a profile. `Header.astro` shares
  the shell's `1040px` measure so the brand lines up with the left edge of the list.
- **Content licence is CC BY 4.0, stated in four places that must agree**: the footer, the
  JSON-LD `license` and `<link rel="license">`, and `public/license.xml` in RSL 1.0 form for AI
  crawlers, found through the `License:` directive in `public/robots.txt`. `LICENSE` in
  `src/consts.ts` is the source for the first three. The footer said "All rights reserved"
  until Aug 2026 — don't put that back, it contradicts what a crawler now reads.
- **Umami is the only third-party request the site makes**, in `BaseHead.astro` and therefore
  on every page. It needs `is:inline` or Astro tries to bundle a script that has to stay a
  request to `cloud.umami.is`. Cookieless, which is why there's no consent banner.
- **Diagrams are D2, inline in the post** as a ` ```d2 ` block, rendered to SVG at build time
  by `astro-d2` running as WebAssembly (`experimental.useD2js`) — so the deploy workflow needs
  no extra step. Mermaid was rejected: it needs a browser, costing either ~1MB of JS shipped to
  the reader or Chromium in CI. Every fence needs a `title="…"`, which `astro-d2` uses as the
  `alt`.
- **The About page is a `profile`, not an article.** Its `pubDate` was dropped in Aug 2026 — a
  date on a profile only claims the page was written that day — which is why `pubDate` is
  optional in `BlogPost.astro`'s props. The page itself was expanded the same day from two
  paragraphs into what he's worked on, why he studies architecture, and what he builds with.

## Content — published (20 posts)

The early chronology:

1. **"Building was always the point"** (`fifa-modding-at-14.md`, Apr 2023, `early-projects`) —
   LEGO ziggurats and a 1998 Pentium through to hex-editing FIFA files: footballmatch.it, the
   import tools, the Superpatch on a magazine cover, later 3D stadium modding. Images
   recovered from the Wayback Machine.
2. **"Building software my school needed"** (`school-software-at-16.md`, Jul 2023,
   `early-projects`) — picking a technical institute over the liceo and spending two years on
   accounting; Scrutini, GeCo, Ambito5. Hero is the school's own computer lab.
3. **"Graded by someone who didn't understand what I'd built"**
   (`graded-by-someone-who-didnt-understand.md`, Oct 2024, `early-projects`) — a BlaBlaCar
   clone on an early MVVM framework, and a grade that showed the professor hadn't understood
   it. Hero is the Knockout.js banner.
4. **"My thesis: Hadoop vs. MySQL, and an honest result nobody expected"**
   (`big-data-thesis.md`, Mar 2024, `early-projects`) — a Hive-vs-MySQL data warehouse
   benchmark on real Twitter/places data. The new technology didn't win by default.
5. **"The freelance years: real clients, and a lesson school never taught me"**
   (`freelance-years.md`, Dec 2024, `career`) — Freelancer.com plus local clients, and the
   human-side-matters-as-much-as-code lesson.

The blockchain cluster (all on the Koinos chain, all `blockchain`):

6. **"I didn't want to trade crypto. I wanted to build on it."** (`how-i-found-koinos.md`,
   May 2023) — buying crypto in 2020, finding DeFi, and Solidity's learning curve sending him
   looking for something else.
7. **"The blockchain that felt like web2, and the mobile wallet it was missing"**
   (`konio-mobile-wallet.md`, Oct 2023) — Konio part 1. Why Koinos was approachable
   (AssemblyScript, REST APIs, koilib, mana + payer semantics), and local state as the real
   challenge when the device is the only copy of the data. Also the App Store fight: guideline
   3.1.5(b) requires an *organization*, so it shipped under E-Time. Won the Koinos Supercharger
   hackathon, first place.
8. **"A migration with no undo, and 2,000 users in three weeks"**
   (`konio-migration-and-growth.md`, Jan 2024) — Konio part 2. Normalizing the v1 data model on
   users' phones with no backup and no undo, the UI rework, the community-fed JSON registries,
   the November 2023 giveaway, and the account-model ceiling.
9. **"A prediction game with no fees, and the server that keeps time for it"**
   (`blockchain-cant-tell-the-time.md`, Jun 2024, updated Feb 2025) — Kuku Games, commissioned
   work that ran on mainnet for a few months. A one-dollar bet rules out any chain with fees;
   Koinos has none, but also no oracle, so the clock and the price come from one server, and
   that server is the trust model.
10. **"Veive: turning a blockchain account into something you can program"**
    (`veive-smart-accounts.md`, Mar 2025, also `architecture`) — modular smart accounts
    inspired by ERC-7579; the missing EntryPoint producing better authorization coverage than
    the standard it was ported from; scopes, hooks and executors. **The site's only video
    hero.**
11. **"No system call for that: getting passkey and JWT signatures verified on chain"**
    (`onchain-signature-verifiers.md`, Apr 2025) — sourcing P-256 from BearSSL and RSA from
    Chrome OS verified boot rather than writing cryptography, and porting them into the chain's
    VM. Hero is an authored D2 diagram.
12. **"Sovrano: a self-custody wallet you open with a fingerprint"** (`sovrano-wallet.md`,
    Jun 2025) — passkeys and social login as the account's own signature rule, the identity
    broker and its honest centralization cost, redirect-based dApp integration. Four videos in
    the body.
13. **"A wallet inside a chat app that holds no keys"** (`wallet-in-a-chat-app.md`, Jul 2025) —
    the Sovry Telegram bot as a remote control for a signer that lives elsewhere, rather than
    as a wallet.

Career, architecture and AI:

14. **"My space, my challenges, my memories"** (`my-space-my-challenges-my-memories.md`,
    Mar 2023, `career`) — the opening post: why he's writing any of this down. Hero is the
    real black-and-white portrait, which is also the home page's social image and the source
    for the square crop in the profile card.
15. **"Quality was nobody's job, and then it was mine"** (`quality-was-nobodys-job.md`,
    Oct 2025, `career`) — eight years at a software house in two halves, consulting until 2019
    then the company's own B2B SaaS. Two opposite ways of losing quality. The employer, the
    clients and the product are all deliberately unnamed. Hero is an authored D2 diagram.
16. **"An air conditioner on my own network, and nobody else's"**
    (`air-conditioner-without-a-cloud.md`, Dec 2025, `homelab`) — an ESP8266, an IR LED and a
    receiver running Tasmota, fitted inside the machine it controls, instead of a box that
    routes the command through the manufacturer's data centre.
17. **"Architecture as a standard, not a suggestion"** (`architecture-as-a-standard.md`,
    Mar 2026, `architecture` + `ai`) — hexagonal clean architecture on NestJS with the
    dependency rule enforced on the import graph, and a composition root as the only place
    allowed to know every piece. The template repo is private, so the post links nowhere.
18. **"The cost of writing collapsed. The cost of checking didn't"** (`cost-of-checking.md`,
    May 2026, `ai` + `architecture`) — Obrussa: treating AI-assisted development as a system
    problem, with explicit context, a blocking gate and durable state.
19. **"Same word, two different jobs: sysadmin before and after AWS"**
    (`sysadmin-before-and-after-aws.md`, Jul 2026, `career`) — systems administrator twice, a
    decade apart, and how little of the LAMP job carried over to the AWS one.
20. **"Permissions are two problems, not one"** (`permissions-are-two-problems.md`, Aug 2026,
    `architecture`) — "can this user see this?" versus "what can this user see?", and why every
    authorization engine answers the second one badly. The most recent post.

## Editorial rules established (see AGENTS.md/CLAUDE.md for the full version)

- No unifying "thesis" framing for the blog as a whole.
- No cross-references between posts — each stands alone, time-anchored with explicit
  years instead of relative references to other posts.
- No personal provenance details (cities, private individuals' names, client names);
  public community-figure citations are fine when explicitly confirmed. Companies are
  fine: E-Time is named as Konio's publishing entity.
- Only real images in post bodies; no stock/placeholder images, no fabricated UI.
  AI-generated project artwork counts as decoration and was skipped even where the project
  itself had published it. Explanatory diagrams are the one thing that may be authored, and
  only from something real — a diagram stops where the post stops.
- Every post has a hero, and the hero is about that post — same bar as the body, never
  decorative, and not too many diagrams.
- Every post has section headings, a heading says what its section establishes, and a section
  stays under ~350 words (ideally 100–250). Two posts were walls of text until Aug 2026, the
  worst structural defect the site has had.
- Name a source, link the source, on first mention — and check the URL resolves. Five posts
  were missing this until Aug 2026. Posts 1–5 largely predate the rule.
- A definition must survive being lifted out of the paragraph around it.
- Tables only for comparisons that are measured, not argued.
- A topic/cluster can get more than one post over time.
- `pubDate` is **not** today's date: the blog is backdated to read as an archive kept since
  2023. Decide the voice first (contemporaneous or retrospective), then the date, checking the
  timeline table in `notes/content-plan.md`.

## Next

- **`homelab` has only one post** (`air-conditioner-without-a-cloud`), which breaks the
  two-posts-per-tag rule and leaves a thin tag page — now visible as a tab on every listing
  page. Either write the second homelab post or fold the tag.
- **Keep alternating clusters** — don't run several Koinos posts back to back. Candidates in
  `notes/content-plan.md`: boticam (Cluster 4b, and its repo is not on this machine) and more
  of the AI-assisted-coding thread (Cluster 6). The palumb cluster is **on hold** until the
  project is public — don't propose it.
- Consider retrofitting outbound links into the early-chronology posts, which predate the
  link-the-source rule.
- `notes/` holds both `GEO-ANALYSIS.md` and a stale lowercase `geo-analysis.md`. Both are
  gitignored; delete the duplicate when convenient.
- Housekeeping flagged during the blockchain work: four private repos have committed
  secrets — `sovrano-io/identity-broker/keys/private.key`, the bot tokens in
  `sovrano-io/telegram-wallet/env.local` and `kukugames/prediction-dapp/.env`, and Koinos
  keys in `veive-io/verifier-p256/scripts/.env`. Nothing is exposed in a public repo;
  rotation is hygiene, not an emergency. Not blog work.
