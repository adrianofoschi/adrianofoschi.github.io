---
title: 'How it started: modding FIFA at 14'
description: "From LEGO ziggurats and a 1998 Pentium to hex-editing FIFA files by hand: founding footballmatch.it at 14, building a suite of import tools, and landing a Superpatch on an Italian magazine's cover."
pubDate: 'Jul 31 2026'
updatedDate: 'Aug 4 2026'
tags: ["early-projects"]
---

## Building, not the result

As a kid I didn't have many toys, and I was a quiet, reflective sort who mostly kept to himself. LEGO was the only toy that mattered. I was fascinated by ancient history, and I'd spend hours flipping through history atlases, staring at ziggurats and pyramids, then rebuilding them piece by piece with thousands of bricks. When I finished — hours later — I'd show my parents, and tear it down a few minutes after. It wasn't frustration: I felt satisfied, but the result itself barely interested me. What I actually loved was building.

## A Pentium in the house, in 1998

In 1998, at nine years old, an encyclopedia on CD-ROM arrived in the mail. Floppy disks were still the norm back then, and a personal computer at home was far from a given — especially in Italy. My father looked at the box and asked the right question: "How do we even look at this? Should we get a computer?" The answer was a Pentium 1, one of the processors that were bringing computers into ordinary households in those years, with plenty of successors still to come over the next decade. I didn't know it yet, but that machine would become my first real tool.

## FIFA arrives, and leaves just as fast

FIFA '98 showed up for my birthday. Playing it was exciting — FIFA was becoming the PC football game of the era — but the excitement didn't last: I got bored fast. The following year I got FIFA '99, and this time the excitement never even arrived. The internet, meanwhile, was a different world: a painfully slow 56k connection, little content, hard to find, and — in Italy at least — used by a small minority of the initiated.

## The communities behind the game

I discovered that behind FIFA there were huge online communities, including actual developers. They built patches that updated the original game: team names and lineups after every transfer window, more realistic kits and boots, player faces, new stadiums, and much more. The communities I remember most fondly are Fifamania.it, Fifaonline.it, and Soccergaming.com. I started as a user, downloading patches and installing them, but that wasn't enough for long — I wanted to understand how they worked. What were those `.bin` files? How had people made them?

## Learning alone, one byte at a time

There was no Stack Overflow, let alone ChatGPT. Information was scarce, and whoever had it tended to guard it jealously instead of sharing it. I taught myself, the hard way, what those files contained and how to modify them — one hex editor session at a time, with nobody around to tell me where to start.

## FIFA 2000, ADSL, the first editors

FIFA 2000 arrived along with ADSL, and everything sped up. The internet became accessible to everyone, and information started circulating far more freely. I finally managed to build my first patches using editors that EA Sports itself provided. I remember endless restarts of the game: every patch I broke by mistake would crash everything, and I'd start over. I began producing kits, boots, and player faces, published on the same sites I'd discovered as a user. The happiness was overwhelming: my name was online, and thousands of people were using and appreciating my work.

## footballmatch.it, the step up

In 2001 I took the leap: I built my own site, a competitor to the ones I'd been using as a fan — footballmatch.it. I put it together in one sleepless night with my father, using Microsoft FrontPage. At first I did everything with the visual editor, driving myself crazy trying to make it look the same in Internet Explorer and in Mozilla. Then I discovered that underneath that visual editor was plain HTML and CSS, and that writing it by hand was far more fun — and far more reliable — than trusting the WYSIWYG. That was the moment, without my quite realizing it yet, that sealed a pact with my future: I had become a programmer. I put together a team, we shipped free updates every week, and I reached 10,000 unique monthly visitors — a huge number for the era, and even more so for a teenager. Across the community, thousands of people used my work assuming they were dealing with a grown man, maybe with a family of his own. I was just a kid.

## The tools before the product

Redoing every texture and every record by hand, in a hex editor, didn't scale to what we needed. So I started building tools — not as an end in themselves, but because kits, boots, faces and flags all had to be produced at volume for the patches we were actually shipping. A few of the tools that came out of that:

- **Footballmatch Face Importer 2.0** — imported custom player face textures into the game's `.fsh` format, with a live 3D preview of the face and hair mesh before importing.
- **Footballmatch Player Edit** — a fuller editor: face textures, hairstyles, boots, gloves, even shin guards, all through a proper Windows GUI instead of a hex editor.
- **Footballmatch Flags Importer** — swapped team badges and banners, with thumbnail previews of every asset before you committed to importing it.
- **Footballmatch Shoes Importer** — the same idea, scoped to boot textures.

![Footballmatch Face Importer 2.0: two panes previewing a player's head and hair mesh, dropdowns for the structure and the hairstyle, and a list of face texture files with import buttons](../../assets/blog/fifa-modding/face-importer.jpg)
_Footballmatch Face Importer 2.0 — the preview was the whole point: see the head before writing it into the game's texture archive._

None of these tools, though, were really the product: they were the assembly line. The real product was the patch — a complete, installable bundle of updated squads, kits, boots, flags, faces and eventually stadiums, turning a stale FIFA install into something close to the current season.

![Footballmatch Player Edit, a Windows tool for editing FIFA player textures, boots and gloves](../../assets/blog/fifa-modding/player-edit.jpg)
_Footballmatch Player Edit — face, hair, boots, gloves and shin guards, all through dropdowns instead of a hex editor._

## The Superpatch on the newsstand

I reached out to *Giochi per il mio Computer*, one of the best-known PC gaming magazines in Italy at the time, to pitch the Superpatch — the full package that updated FIFA with squads, kits, flags and everything else. It made the newsstand, and millions of Italians saw my name printed on the cover. I was stunned: up to that point, my audience had been a handful of forums. Seeing it land in front of an entire newsstand's worth of readers was the first time the hobby felt like it might be more than a hobby.

## Building, not playing

In the meantime, without quite noticing it, I'd become an all-round editor: 2D graphics for kits and boots, 3D graphics for stadiums and faces, plus the tools to produce all of it at scale. And yet, of all those sleepless nights, not one was spent actually playing a match of FIFA or PES. My mission had never been to play — it was to build. It was that realization, pieced together without my knowing it, that led me — a few years later — to choose my course of study: an experimental computer science program.
