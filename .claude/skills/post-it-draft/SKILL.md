---
name: post-it-draft
version: 1.0.0
description: Drafts a new blog post, or revises an existing one, through an Italian-first review workflow — outline first, then paragraph-by-paragraph approval in Italian — before producing the final English post file. Use whenever writing a new post for this blog, or when redoing/revising one of the already-published posts.
---

# Post-it-draft: Italian-first blog post workflow

This blog (`adrianofoschi.com`) publishes in English only, but the author reviews
content more easily in Italian. This skill drafts entirely in Italian first, gets
paragraph-by-paragraph sign-off, and only translates to English at the very end.

Two modes — figure out which one applies before starting:

- **New post**: no existing file. The user gives you a topic.
- **Revision**: an existing file in `src/content/blog/*.md` is being redone. Read it
  first — its English text is the source material, not a topic to invent from scratch.

Always re-read `CLAUDE.md` at the repo root before drafting — it holds the editorial
rules below plus any other current constraints. Apply them in the Italian draft, not
just at translation time (rule violations are much cheaper to catch in Italian):

1. No cross-references to other posts — anchor events with an explicit year/year range.
2. No personal provenance details (no hometowns/schools tied to Adriano, no real names
   of private individuals — generic references like "my father", "a collaborator").
   Public figures cited as verifiable sources are fine only if Adriano explicitly
   confirms it for that case.
3. Only real images in the body (Wayback Machine, personal archives, project repos) —
   never stock or fabricated images. No images survive → no image, don't invent one.
4. No hero image, no per-post header image.
5. Tags come from the closed vocabulary in `src/consts.ts` (`TAGS`). A tag needs at
   least two posts to justify existing — don't propose a new one for a single post.

---

## Step 1 — Establish the topic and scaffolding

**New post:**
- Ask what the post is about, if not already clear from the user's message.
- Ask which existing tag(s) from `src/consts.ts` apply, or whether this needs a new
  tag (only viable if a second post already exists or is planned for it).
- Check whether any real images exist for this topic (ask the user; don't assume none).
- Ask the temporal voice (see below) before outlining.

**Revision:**
- Read the existing post file and its frontmatter (title, description, pubDate, tags).
- Read its current English body — this is the baseline, not a blank page.
- Ask the user what's driving the redo: a full rewrite, fixing specific weak spots,
  updating stale claims, or just a fresh editing pass. This changes how much of the
  existing structure/content survives vs. gets rebuilt.
- Ask the temporal voice (see below) before outlining — even if the post was already
  classified in a prior session, confirm it still holds; voice can be the sole reason
  for a redo.

**Temporal voice — always ask explicitly, never infer from the topic's era.** Every
post is either:
- *today looking back at the past* — retrospective, hindsight allowed (e.g. "that habit
  saved me more than once since," honest-outcome closings);
- *as if it were happening today* — contemporaneous, no hindsight at all: no sentence
  may reveal anything only knowable from later than the period the post narrates;
- *mixed* — pin down exactly which section/beat is remembered-past and which is not,
  before outlining, so the split is deliberate rather than accidental.

Don't assume from whether the topic is "youth" or "professional" — confirmed wrong once
already: a professional-era post was classified retrospective, same as a youth one.
There is no default; ask every time.

Then ask a *small* number of targeted questions (don't over-ask) needed to fix the
paragraph-level outline: what's the arc of the post, what's the opening hook, what
concrete details/dates/examples exist for each beat, where (if anywhere) it should
end up.

Propose the outline as a numbered list of sottotitoli (subheadings) in Italian.
Iterate on the outline itself until the user approves it — do not write prose yet.

---

## Step 2 — Draft paragraph by paragraph, in Italian

Once the outline is approved:

- Write ONE paragraph (or section, if a subheading covers a short section) in Italian.
- Present it and stop — wait for explicit approval before moving to the next one.
- If the user requests changes, revise that same paragraph and re-present it. Don't
  advance until it's approved as-is.
- Keep momentum: don't re-litigate already-approved paragraphs unless the user brings
  one back up, and don't restate the full draft-so-far on every turn — just the piece
  under review, unless the user asks to see the whole thing.
- Keep applying the editorial rules from Step 0 as you write, not just at the end.
- Keep applying the temporal voice decided in Step 1 as you write each paragraph — for
  a contemporaneous post, watch for hindsight slipping in (e.g. "years later," "it turned
  out," anything implying knowledge from after the narrated period) and flag it rather
  than let it pass.

Work through the outline top to bottom this way until every paragraph is approved.

---

## Step 3 — Translate and finalize

Once the full Italian draft is approved:

1. Translate the whole piece to English as one pass, preserving the intent and voice
   rather than translating sentence-by-sentence literally — read naturally as an
   English post, not as a translation.
2. Re-check the five editorial rules against the English text.
3. Write frontmatter:
   - `title`, `description` in English.
   - **New post**: `pubDate` as today's date (e.g. `'Aug 4 2026'` style, matching
     existing posts), `tags` from the closed vocabulary.
   - **Revision**: keep the original `pubDate` unchanged; if the rewrite is
     substantial, add/update `updatedDate` to today's date.
4. Save to `src/content/blog/<slug>.md` (new post: pick a slug from the title,
   matching the kebab-case convention of existing files).
5. If real images were identified for the post, confirm where they should go under
   `src/assets/blog/<post-dir>/` and reference them inline.
6. Show the final English text for a last check before considering the post done.

Do not run `npm run build` / start the dev server unless the user asks to see it
rendered — the file write itself is the deliverable here.
