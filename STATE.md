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
- Theme: full rewrite from the Astro blog starter's default look to a minimal dark
  theme — black background, IBM Plex Mono everywhere (Google font provider), cyan
  accent, borders instead of box-shadows, `prose-invert` for post content. Original
  template placeholder posts and the local Atkinson font files were removed.
- Hero images are generated, uniform and mandatory: every post has a `hero.png` at
  1200×630, produced by `scripts/generate-heroes.mjs` (ImageMagick + IBM Plex Mono fetched
  into the gitignored `.cache/fonts/`). Because they all share one aspect ratio,
  `BlogPost.astro` and `[...page].astro` now render them at `w-full h-auto` with a single
  `width` — no height cap, no `w-auto`. Do not pass a `height` to `<Image>`: Astro would
  centre-crop the asset. Inside the frame, source screenshots are contain-fit, never
  cropped to fit; per-source `crop` in the script's `POSTS` table exists only to remove
  junk (a video player bar, an over-long docs page), not to force the ratio.

## Content — published (12 posts)

Posts 1–4, the early chronology:

1. **"How it started: modding FIFA at 14"** (`fifa-modding-at-14.md`, Jul 2001–2005) —
   footballmatch.it: custom Windows tools (face/kit/flag/boot importers), the FIFA 2003
   Superpatch, later 3D stadium modding with Rhino 3D building on Giorgio Lunardon's
   work, then PES 3/4/5. Images recovered from the Wayback Machine.
2. **"Building software my school actually used, at 16"** (`school-software-at-16.md`,
   2006) — Scrutini (Access), GeCo (Visual Basic), Ambito5 (.NET/AJAX institutional
   portal for a 5-municipality social-services project). No images survive.
3. **"The freelance years: real clients, and a lesson school never taught me"**
   (`freelance-years.md`, 2013–2015) — Freelancer.com + local clients, commercial sites
   and management software, the human-side-matters-as-much-as-code lesson. No images.
4. **"My thesis: Hadoop vs. MySQL, and an honest result nobody expected"**
   (`big-data-thesis.md`, 2009 degree start / 2012 thesis) — a Hive-vs-MySQL data
   warehouse benchmark on real Twitter/places data. Diagram is the thesis's own image.

Posts 5–11, the blockchain cluster (2023–2025, all on the Koinos chain):

5. **"The blockchain that felt like web2, and the mobile wallet it was missing"**
   (`konio-mobile-wallet.md`) — Konio part 1. Why Koinos was approachable (AssemblyScript,
   REST APIs, koilib, mana + payer semantics), what shipped, and local state as the real
   challenge when the device is the only copy of the data. Also the App Store fight:
   guideline 3.1.5(b) requires an *organization*, so it shipped under E-Time. Won the
   Koinos Supercharger hackathon, first place.
6. **"A migration with no undo, and 2,000 users in three weeks"**
   (`konio-migration-and-growth.md`) — Konio part 2. Normalizing the v1 data model on
   users' phones with no backup and no undo, the UI rework, the community-fed JSON
   registries, the November 2023 giveaway, and the account-model ceiling.
7. **"Veive: turning a blockchain account into something you can program"**
   (`veive-smart-accounts.md`) — modular smart accounts inspired by ERC-7579; the missing
   EntryPoint producing better authorization coverage than the standard it was ported
   from; scopes; what hooks and executors actually build.
8. **"Sovrano: a self-custody wallet you open with a fingerprint"** (`sovrano-wallet.md`) —
   passkeys and social login as the account's own signature rule, the identity broker and
   its honest centralization cost, redirect-based dApp integration.
9. **"No system call for that: getting passkey and JWT signatures verified on chain"**
   (`onchain-signature-verifiers.md`) — sourcing P-256 from BearSSL and RSA from Chrome OS
   verified boot rather than writing cryptography, and porting them into the chain's VM.
10. **"A blockchain can't tell the time: the off-chain half of an on-chain game"**
    (`blockchain-cant-tell-the-time.md`) — Kuku Games, commissioned work that ran on
    mainnet for a few months. The clock and the price both come from one server; the
    mitigation is making that component fail safe rather than fail expensive.
11. **"A wallet inside a chat app that holds no keys"** (`wallet-in-a-chat-app.md`) — a
    Telegram bot as a remote control for a signer that lives elsewhere. No image survives.

Post 12, back off the blockchain cluster:

12. **"Quality was nobody's job, and then it was mine"** (`quality-was-nobodys-job.md`,
    2015–2023) — eight years at a software house in two halves: consulting for clients in
    regulated sectors until 2019, then the company's own B2B SaaS. Two opposite ways of
    losing quality — too much roadmap rigidity on one side, too little on the other. The
    employer, the clients and the product are all deliberately unnamed; the post is scoped
    explicitly to what he saw rather than to a verdict on any industry. No inline images,
    no outbound links, typographic hero.

## Editorial rules established (see AGENTS.md/CLAUDE.md for the full version)

- No unifying "thesis" framing for the blog as a whole.
- No cross-references between posts — each stands alone, time-anchored with explicit
  years instead of relative references to other posts.
- No personal provenance details (cities, private individuals' names, client names);
  public community-figure citations are fine when explicitly confirmed. Companies are
  fine: E-Time is named as Konio's publishing entity.
- Only real images in post bodies; no stock/placeholder images, no fabricated UI.
  AI-generated project artwork counts as decoration and was skipped even where the project
  itself had published it. Posts 2, 3 and 11 still have no inline images — nothing
  survives for them (checked again: the freelance-era repos only hold client-site theme
  screenshots, which the no-client-names rule excludes, and `sovrano-io/telegram-wallet`
  has no images at all).
- Heroes are a separate thing from body images, and every post has one. They are generated
  onto the site theme at a uniform 1200×630 by `scripts/generate-heroes.mjs`: real
  screenshots contain-fit inside the frame, or — for posts 2, 3 and 11 — a typographic
  card quoting a line from the post itself. Every hero carries the same accent tick and
  `project · years` caption. Screenshots that used to serve as a raw heroImage were moved
  into the article bodies (face importer, Konio balance screen, Veive docs site, the
  P-256 verify flow); `nft-autotracking-cover.png` stays hero-only, since the post never
  discusses that release.
- A topic/cluster can get more than one post over time.
- Outbound links are welcome, introduced with the blockchain cluster. Verify every URL
  resolves before publishing. Posts 1–4 predate this and carry no links.

## Next

- **Keep alternating clusters.** Post 12 broke the Koinos run; don't go straight back to it.
  Candidates in `notes/content-plan.md`: the Hitech→AWS sysadmin thread (Cluster 12, needs
  an input session — the CV is thin), boticam (Cluster 4b, and its repo is not on this
  machine), the AI-assisted-coding thread (Cluster 6). The palumb cluster is **on hold**
  until the project is public — don't propose it.
- Consider retrofitting outbound links into posts 1–4.
- Housekeeping flagged during the blockchain work: four private repos have committed
  secrets — `sovrano-io/identity-broker/keys/private.key`, the bot tokens in
  `sovrano-io/telegram-wallet/env.local` and `kukugames/prediction-dapp/.env`, and Koinos
  keys in `veive-io/verifier-p256/scripts/.env`. Nothing is exposed in a public repo;
  rotation is hygiene, not an emergency. Not blog work.
