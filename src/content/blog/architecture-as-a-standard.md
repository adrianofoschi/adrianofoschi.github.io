---
title: "Architecture as a standard, not a suggestion"
description: "Where AI-assisted coding actually fails isn't algorithms, it's architectural boundaries. So I stopped leaving structure to the model: hexagonal clean architecture on NestJS, with the dependency rule enforced on the import graph and a composition root that is the only place allowed to know every piece."
pubDate: 'Mar 3 2026'
tags: ["architecture", "ai"]
---

Since the AI era began, every one of us developers has watched our value as programmers depreciate: writing code was the skill the job rested on, and it has become the part a machine does in seconds. Ask for a feature and you instantly get hundreds of lines — the cost of writing is essentially gone. But that cost doesn't vanish, it moves to checking, and checking is more expensive than writing: reviewing code you didn't write is tiring, and reviewing mountains of it much more so. There's no escape in verifying step by step either, because you don't know up front where the model is heading — you're judging a move without knowing the game. That's where vibe-coding starts: not out of laziness, but because at some point genuinely verifying costs more than accepting and hoping.

## Where does AI-assisted coding actually fail?

There is one thing I've noticed with some consistency, though: the point where these tools fail isn't implementation. Ask for an algorithm, a transformation, a complicated query, and it comes out correct — that's exactly the kind of closed problem they're strong at. What comes out arbitrary are the architectural boundaries: where to put a file, which layer may know which other, how information should travel between layers, what belongs to the domain and what to infrastructure.

The framework alone doesn't fix it. A framework gives you bricks and a few conventions, but it isn't rigid enough: it leaves too many roads open, all equally plausible. And when every road is plausible, the choice becomes arbitrary — not wrong, random. Two similar features end up structured two different ways, and neither violates any rule, because the rule doesn't exist.

## Giving the AI a pattern to treat as scripture

The most effective lever I've found is removing that ambiguity up front: hand over a precisely documented design pattern and require it be treated as scripture, not as a suggestion. If the organization of the code is already decided, it isn't something the model has to invent — and the space in which it can go wrong shrinks to what it's actually good at.

The catch is that this only works if you know that pattern, and know it well. I should be honest about my starting point: I've built a lot of experience on complex, highly scalable systems, but I built it in the field, almost never approaching the material theoretically. I knew how to make things work without always being able to name the principle I was applying — which is probably the norm among experienced developers rather than the exception. To have a model put a principle into practice, though, I need to know it with a precision I never needed before: I have to be able to write it down, justify it, and tell the case where it holds from the case where it doesn't. That's the unexpected gain of this period — the machine writes the code, I have to know the theory, and better than before.

## The choice: hexagonal clean architecture

The pattern I started studying most seriously is hexagonal clean architecture. Let me say it immediately: for many projects it's overkill, and I have no intention of arguing otherwise. The ceremony it demands — ports, adapters, a layer that isn't allowed to talk to another — is hard to justify on a small service that just needs to work.

But it's effective precisely where it's needed here, for three reasons. First: it doesn't leave the model any choice about how to organize the code, because the structure is decided before a line is written. Second: it states explicitly how information travels between layers, which is the other half of what goes arbitrary when a rule is missing. The third matters with no AI involved at all: separating the domain from technical details preserves the application's ability to evolve, and an application that can replace pieces without rewriting itself is an application that lasts.

As a framework I picked NestJS, which comes with modules and dependency injection out of the box: the layers have something to rest on instead of having to be simulated. Everything that follows is the rigidity I added on top.

## Four layers, and the dependency rule

There are four layers and the dependencies all point inward. At the centre, the **domain**: entities, value objects, events, and zero framework imports — no decorators, no database driver, no notion that HTTP exists. Around it the **application**, which depends only on the domain, orchestrates the use cases and declares the **ports**, the interfaces describing what it needs from outside. At the edge, two families of adapters: **infrastructure** implements those ports against the real world — repositories, HTTP clients, providers — and **presentation** is the way in: controllers, DTOs, CLI, translating the outside world into use-case calls.

The hard rule is that inner layers never import outer ones. The domain stays testable with no database and no framework, and database, framework and entry channel become replaceable details — that's the invariant of all clean architecture, not a preference of mine.

There is one part of that rule I care about more than the rest, because it's the part most often forgotten: **infrastructure and presentation do not import each other**. They're siblings at the edge, not one stacked on the other, and whoever composes them is what puts them in touch. A controller that could import a repository directly would have a road around the use case — and that road would get taken, if not by me then by an agent looking for the shortest path from request to database. Forbidding it in both directions is what makes the use case the only way through instead of the recommended way through.

## Ports owned by the consumer, and the composition root

The piece that took me longest to genuinely understand isn't the pyramid of layers, it's where ports and their adapters live.

A port is always declared **where it is consumed**, never where it is implemented. The consumer states what it needs — an interface saying "I need to be able to save a subscriber", written in the application layer of the module that has to save one — rather than the provider announcing what it offers. It looks like a detail about where files go, and it's actually the direction of the dependency: if the port belonged to whoever implements it, the centre would have to know the edge, and the inversion the whole pattern rests on wouldn't be there.

Where the adapter lives, on the other hand, depends on which boundary it crosses. In the normal case it sits in the infrastructure of the same module, wired by that module: ordinary clean architecture, entirely internal. But when an adapter would cross a boundary between modules it can't sit there, because to implement that port it would have to import the other module — and that import is exactly what the boundary forbids. So the port stays with the consumer, and the adapter is provided and wired by the **composition root**: the application that composes the modules.

This was the thing I understood worst at the beginning, and I mistook it for a loophole — a place where the rules count for less. It's the opposite. The composition root is the only point in the system with the right to know every piece, and it exists precisely so that everything else can avoid knowing each other: a module declares *what* it needs without knowing *who* will give it, and therefore stays compilable, testable and shippable on its own. Different deployment shapes become different roots composing the same modules with different adapters wired in, without a line inside the modules changing.

## Who enforces the dependency rule?

So far this is a drawing, and a drawing doesn't hold on its own. The difference between a real architecture and a diagram in a README is whether something fails when the rule is broken.

The import graph is checked on every change by a dedicated tool — `dependency-cruiser`, in my case — which is the single source of truth about boundaries and fails the build in CI. An inner layer importing an outer one, an inbound adapter importing an outbound one, a cycle between modules: all blocking errors, not observations left to a code review. And the constraint is declared in one place, instead of scattered across conventions each person remembers their own way.

Two reinforcements matter as much as the main rule. The first is strict dependency resolution: a package a module hasn't declared doesn't even resolve, so the wrong import dies at build time and never reaches the linter. The second is that every module must be able to compile **on its own**: it's the most honest test of independence, because a hidden dependency doesn't survive compiling in isolation — there's no way to "nearly" pass it.

This is the part that changes character when the other side is a model rather than a person. You explain a convention to a colleague and count on them remembering it, and if they forget you find out in review. An agent needs something that tells it no mechanically, immediately, every time — and that says it before hundreds of plausible lines have been written in the wrong place. A rule that lives only in a document is, to an agent, a suggestion.

## The conventions inside the layers

Boundaries say where a thing may live; they don't say how it's written. That part is conventions, and their usefulness isn't being clever — it's being **already decided**.

The first is the role suffix in the filename: `*.use-case.ts`, `*.port.ts`, `*.adapter.ts`, `*.repository.ts`, `*.vo.ts`, `*.controller.ts`, `*.dto.ts`. The role — and therefore the layer that file belongs in — reads at a glance, and that isn't only a human benefit: it makes it immediately obvious, to an automated reviewer too, that a file named `*.repository.ts` sitting in the application layer is in the wrong place.

Then there's how domain objects are constructed, which is the convention I care about most. A value object is immutable and validates on construction, through a static factory with a private constructor: from outside you cannot call `new`, and the only available entrance validates and normalizes. The consequence is stronger than a recommendation — invalid state isn't discouraged, it's **unrepresentable**: a malformed email never becomes a value object, so there is no point in the system it could reach. Entities follow the same logic with two distinct factories, one to create a new instance, which emits a domain event, and one to rebuild it from the database, which doesn't — because re-reading a row isn't something that just happened.

Above the domain, the use cases: one per operation, one file each, flat, and **zero business logic**. They orchestrate — call ports, build entities, use value objects — but the business rule lives in the domain, not there. Controllers are the mirror image: validate the DTO, map to a command, call the use case, map the response. No logic, ever.

One practical detail worth stating because it's specific to this stack: NestJS can't inject a TypeScript interface, which doesn't exist at runtime. So every port is an interface plus a `Symbol` acting as its injection token. It's the one place where the pattern has to bend to the language, and I'd rather say so than pretend the abstraction is free.

## Two-layer validation, and the error model

There are two validations and they don't duplicate each other, because they answer different questions. At the edge, on the DTO, you validate **shape**: types, required fields, formats, body size. A malformed input is rejected immediately, before touching any logic, and it's a security surface too. In the domain you validate **business**, on construction, so that an invalid domain object doesn't exist. The reason the domain doesn't trust the DTO is concrete: not every entry point comes through a DTO. A CLI command, an event handler, a test build domain objects directly — if the business rules lived in the DTO validator, each of those roads would be an open door.

Errors follow the same separation. There are two hierarchies, both framework-independent: one for business rule violations, one for technical faults. Persistence adapters wrap driver errors in the second, so a database error never reaches the user raw. And nothing is caught in the core: domain, use cases and controllers let it propagate. Exactly two points catch — the persistence adapter, translating the technical inward, and the inbound adapter, translating outward. Two points of translation instead of one scattered through every function.

How it renders outward is by naming convention, not a hand-written map: an exception whose name ends in `NotFoundException` becomes a 404, `AlreadyExistsException` or `ConstraintException` a 409, `PermissionsException` a 403, any other domain violation a 422, and any technical fault a generic 500. The core stays entirely unaware of the protocol — which genuinely matters, because the same set of exceptions has to render on a channel that isn't HTTP: from the CLI those same exceptions become exit codes and messages on stderr, not a mirror of HTTP statuses.

One detail I learned the hard way and consider non-negotiable: every error carries a **stable `code`, decoupled from the class name**. If the code exposed to consumers were the class name, renaming a class — an internal refactor, invisible from outside — would break whoever relies on that code. The class name classifies the status; the `code` is public contract, and the two need keeping apart.

## Persistence: a typed query builder, no ORM

For persistence I moved to a typed query builder — Kysely — and dropped the ORM. The reason isn't stylistic, and it follows entirely from the pattern described so far.

Aggregates, in this model, are **detached**: the repository reads rows and translates them with a mapper, and the domain object that comes out isn't "managed" by anything. Between aggregates there are no relations and no foreign keys — integrity is application-level and cascades are orchestrated by the use cases. Which means every convenience an ORM offers is inapplicable: nothing to track, nothing to lazy-load, nothing to synchronize. And an inapplicable but available convenience isn't neutral: it's implicit state sitting there for whoever uses it by mistake, with effects that surface far from where it was used. On a managed object model an ORM is the right call; here it would be an engine left running under the floor.

The consequence that convinced me most, though, is about declaring the schema. **The migration is the only declaration of the schema**: the types describe the *shape* of the rows — column names, types, what can be omitted on insert — while the *structures*, meaning primary keys, unique constraints and indexes, live only in the migration that creates them. From which follows something worth stating in full: there is no schema-versus-types drift check, because there is no second declaration to reconcile. An ORM requires that check *because* it forces you to declare twice — the entity metadata and the migration SQL — so the check solves a problem the tool itself introduced. Here that class of error isn't caught better: it isn't representable.

I have to state the reverse too, because it appears to contradict what I just wrote. Columns — name, type, nullability — are described twice, in the migration and in the row type, and nothing verifies it mechanically. That's a choice, not an oversight: a mismatch between types and schema isn't a catastrophic or irreversible invariant, so it doesn't warrant a blocking check, and the burden stays with whoever writes it. In practice the immediate effects police it: column names go straight into the SQL, so a wrong one fails the integration tests against a real Postgres right away; a column declared and absent breaks the query selecting it. What's genuinely left uncovered is nullability on a path no test exercises — and I'd rather know that and say it than believe I'm covered.

One last detail that strikes me as the most elegant part of all this: each migration is typed against the world it was born in, not the current schema. Otherwise code that is immutable by definition — an applied migration is never touched — would depend on something that evolves, and an old migration would stop compiling at the first schema change.

## Why this suits working with an AI

The benefit is narrower than the topic suggests, and I want to calibrate it precisely: an explicit standard plus a check that actually runs does not make generated code **correct**. It makes it **placeable**, and it makes boundary errors visible early and mechanically. Those are two different things, and only the second is what architecture buys you.

Placeable means the question "where does this piece go" already has an answer before the model starts. It doesn't have to invent a structure, and therefore can't invent a different one next week for a similar feature: the arbitrary part — the thing I said at the start is the real point of failure — has been removed from the problem, not delegated more skilfully. And there's a side effect I appreciated more than I expected: the architecture doesn't have to live in the prompt. It lives in the repository, in normative files the model reads, and it doesn't need repeating every conversation or remembering by me.

Then there's a division of verification labour that turned out to be the most useful part. **Structural** violations — a layer importing outward, an inbound adapter touching an outbound one, a module that won't compile alone — aren't matters of judgement: a machine catches those, always, and they block. What's left over are the shades of intent: whether that's really orchestration or business logic in disguise, whether the port is declared on the right side. Those are judgements, and they can be made by a reviewer — human or model — reading **the standard itself** as its rubric, not a checklist derived from it. That detail matters: a checklist summarized from a document drifts away from the document; if the reviewer reads the document, there's nothing that can diverge.

The final accounting is this, and it returns to where I started. The cost had moved to checking, and checking mountains of code I didn't write is the expensive part. I haven't eliminated it. I've made one entire class of it — boundaries, which is precisely where these tools go wrong — either impossible or immediately obvious, so that the attention I have left can go to what a machine can't judge.

## What it deliberately leaves open

It's worth saying where this standard is silent, because the silence is designed as much as the rules.

It fixes **structure**, not style. It says where a piece of code goes and who may know whom; it doesn't say how you write inside a layer, how to decompose an algorithm, how to name a local variable, which library to pick for a contained job. Inside a use case or inside an adapter there's all the freedom there ever was. That's a choice about proportion, and it matches this article's thesis: rigidity should be spent where these tools fail, on the boundaries, and not spent where they're already reliable. Constraining implementation too would cost review attention and buy nothing — and a standard that constrains everything is a standard nobody keeps for long.

## What actually moved

The value that seemed to be depreciating wasn't mine: it was one particular form I used to put it in. Writing code was the visible part of the job, but it wasn't the part the expertise lived in — and now that the visible part costs almost nothing, what's left making the difference is knowing where the lines go, and knowing it precisely enough to write it as a rule a machine can check.

That's the paradox of this period, for me: a tool that writes code in my place has made me a more theoretical engineer than I was. I had to properly study what I had only ever practised, because to demand that a model respect a boundary, I have to be able to define it myself first.
