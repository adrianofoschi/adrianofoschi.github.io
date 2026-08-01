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

## Content — published (4 posts)

1. **"How it started: modding FIFA at 14"** (`fifa-modding-at-14.md`, Jul 2001–2005) —
   footballmatch.it: custom Windows tools (face/kit/flag/boot importers), the FIFA 2003
   Superpatch, later 3D stadium modding with Rhino 3D building on Giorgio Lunardon's
   work, then PES 3/4/5. Images recovered from the Wayback Machine.
2. **"Building software my school actually used, at 16"** (`school-software-at-16.md`,
   2006) — Scrutini (Access), GeCo (Visual Basic), Ambito5 (.NET/AJAX institutional
   portal for a 5-municipality social-services project).
3. **"The freelance years: real clients, and a lesson school never taught me"**
   (`freelance-years.md`, 2013–2015) — Freelancer.com + local clients, commercial sites
   and management software, the human-side-matters-as-much-as-code lesson.
4. **"My thesis: Hadoop vs. MySQL, and an honest result nobody expected"**
   (`big-data-thesis.md`, 2009 degree start / 2012 thesis) — a Hive-vs-MySQL data
   warehouse benchmark on real Twitter/places data, sourced from the public
   `uniba-hive-udf` repo and the private `uniba-thesis` LaTeX source. Diagram is the
   thesis's own star-schema image.

## Editorial rules established (see AGENTS.md/CLAUDE.md for the full version)

- No unifying "thesis" framing for the blog as a whole.
- No cross-references between posts — each stands alone, time-anchored with explicit
  years instead of relative references to other posts.
- No personal provenance details (cities, private individuals' names); public
  community-figure citations are fine when explicitly confirmed.
- Only real images; no stock/placeholder images.
- A topic/cluster can get more than one post over time.

## Next

- Pick the fifth post from the backlog in `notes/content-plan.md` (candidates: palumb/
  architecture, blockchain/wallet side projects, the Hitech→AWS sysadmin thread).
- A few backlog items still need one-line clarification from Adriano before drafting
  (see "Open questions" in `notes/content-plan.md`).
