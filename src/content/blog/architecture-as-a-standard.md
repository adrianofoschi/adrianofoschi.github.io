---
title: "Architecture as a standard, not a suggestion"
description: "A service template where the dependency rule is a lint rule and the conventions decide where code goes — which turns out to be exactly what makes a codebase workable with an AI agent."
pubDate: 'Aug 24 2026'
tags: ["architecture", "ai"]
---

In 2026 I built myself a service template: a NestJS skeleton I clone whenever I start a new backend, with all the cross-cutting plumbing already wired and zero business logic in it. Health probes, structured logging, exception filters, OIDC authentication, an event publisher. Nothing in it is clever. The interesting part isn't what it contains — it's that the architecture is not written down as advice. It's enforced.

## The rule, and who owns it

The layout is the usual hexagonal one: four layers, dependencies pointing inward.

| Layer | May import | Holds |
|---|---|---|
| `domain/` | nothing | entities, value objects, domain events, `DomainException` |
| `application/` | `domain` | use cases and ports |
| `infrastructure/` | `domain`, `application` | adapters, modules, filters, config |
| `presentation/` | `domain`, `application` | controllers, DTOs, decorators |

Every project I've worked on has had a diagram like that. On most of them, by year three, the diagram described a building that no longer existed. Not through anybody's bad faith — through a hundred individually reasonable imports, each one a small exception made under deadline, none of them visible until you go looking.

So in this template the table above isn't in a README. It's in `eslint.config.mjs`:

```js
'boundaries/element-types': ['error', {
  default: 'disallow',
  rules: [
    { from: 'domain', allow: ['domain'] },
    { from: 'application', allow: ['domain', 'application'] },
    { from: 'infrastructure', allow: ['domain', 'application', 'infrastructure'] },
    { from: 'presentation', allow: ['domain', 'application', 'presentation'] },
  ],
}]
```

`default: 'disallow'` is the load-bearing line. Anything not explicitly permitted is an error, so a new kind of import doesn't get the benefit of the doubt — it has to be argued for by editing this file, which is a visible act in a diff rather than an invisible one inside a feature branch.

Two consequences worth stating plainly. First, `domain/` imports nothing at all — not even NestJS. Second, `presentation/` cannot import `infrastructure/`: a controller has no way to reach an adapter directly, only a use case and the domain. That one is stricter than most versions of this architecture, and it's the rule I'd expect someone to argue with. I keep it because the alternative — a controller reaching into a repository "just this once, it's a read" — is precisely the individually reasonable import that erases the boundary over time.

## The hole in the rule, on purpose

There is an exemption, and pretending otherwise would be dishonest:

```js
'boundaries/ignore': ['src/main.ts', 'src/app.module.ts', 'src/**/*.spec.ts'],
```

Somewhere, something has to know about everything: which adapter implements which port, which module imports which. That's the composition root, and its whole job is to be the one place where the layers are allowed to meet. Making it exempt isn't a loophole in the rule — it's the rule admitting where wiring lives, so that wiring doesn't have to spread out and hide.

## Conventions that decide, so people don't

A dependency rule tells you what you may not do. Most of the day-to-day questions in a codebase are the other kind: where does this go, what do I call it, what does it return. The template answers those by convention rather than by discussion.

A port is an interface plus a `Symbol` token, framework-free, in `application/ports/`:

```ts
export interface ClockPort {
  now(): Date;
}
export const CLOCK = Symbol('CLOCK');
```

The adapter lives in `infrastructure/`, is `@Injectable()`, and gets bound in a module with `{ provide: CLOCK, useClass: SystemClock }`. Consumers inject the Symbol and depend on the interface. Files carry their role in the name — `*.port.ts`, `*.adapter.ts`, `*.use-case.ts`, `*.module.ts`, `*.controller.ts` — one use case per file, tests co-located.

The part I like most is error handling, because it removes a decision that gets made inconsistently on every team I've been on: which status code is this. In the template, nothing chooses. A use case throws a domain exception and never catches it, and a global filter reads the class name:

```ts
private mapToHttpStatus(exception: DomainException): HttpStatus {
  const name = exception.constructor.name;
  if (name.endsWith('NotFoundException')) return HttpStatus.NOT_FOUND;
  if (name.endsWith('AlreadyExistsException')) return HttpStatus.CONFLICT;
  if (name.endsWith('ConstraintException')) return HttpStatus.CONFLICT;
  if (name.endsWith('PermissionsException')) return HttpStatus.FORBIDDEN;
  return HttpStatus.UNPROCESSABLE_ENTITY;
}
```

Name the exception `OrderNotFoundException` and it is a 404 everywhere, forever, without anyone typing `404`. Infrastructure exceptions map to 500 with the detail logged and never returned to the caller.

Domain events work the same way. Each event carries its own bus channel and serializes its own payload, so the publisher is generic and never needs editing when a new event appears:

```ts
export class OrderPlacedEvent implements DomainEvent {
  readonly occurredOn = new Date();
  readonly eventType = 'orders.order.placed';   // {domain}.{entity}.{verb}, past tense
  constructor(private readonly orderId: string) {}
  payload() { return { orderId: this.orderId }; }
}
```

The adapter wraps whatever it's given in one envelope — `{ eventId, type, occurredAt, data }` — and emits on the channel. Adding an event is writing a class. It is not also editing a switch statement in a publisher, which is the thing that always rots.

## Why this suits working with an AI

Here's what changed my mind about how much of this is worth the effort.

An agent writing code in your repository needs roughly what a new colleague needs: to know where things go, what the constraints are, and how to tell whether what it just wrote is acceptable. The difference is that a colleague absorbs the unwritten half. They notice that nobody here puts logic in controllers, they get told in review, they remember. A model doesn't accumulate that. Every session starts from what it can read.

Which means the tacit standard — the one that lives in the team's habits and in reviewers' heads — is worth nearly nothing to it, and the explicit one is worth a great deal. This template is the explicit one, in three forms that reinforce each other:

**A rule that runs.** The boundary check isn't a paragraph asking nicely; it's `npm run lint`, and it fails. That gives a generated change a verdict that doesn't depend on anybody's attention. If a model reaches from a controller into an adapter — a very natural thing to do, since it works — the build says no before a human ever reads it. Documentation cannot do that. A check can.

**Placement without judgement.** Because roles are in filenames and each kind of thing has exactly one home, "where does this go" has an answer that can be derived rather than guessed. Most of the incoherence I've seen in generated code isn't wrong logic — it's a right thing put in the wrong place, or the fourth slightly different way of doing something the codebase already does three ways.

**Behaviour from naming.** The suffix-to-status mapping and the event channel convention mean the model isn't inventing status codes or channel names. It is naming a class, and the naming is the interface. Fewer free choices means fewer places to be arbitrary, and arbitrary is what you're actually fighting.

The template also carries a `CLAUDE.md` next to its `README.md` — the same architecture, compressed for something that will read it in full every time and has no memory of yesterday. Writing it made the standard better, because the questions you have to answer for a machine ("which layer may import which, exactly?") are the ones that stay comfortably vague between humans.

None of this makes generated code correct. It makes it *placeable*, and it makes wrongness visible early and mechanically. That's a smaller claim than the one usually being sold, and it's the one I'd defend.

## What it deliberately doesn't decide

A standard that decides everything is a framework, and I didn't want a framework. So the baseline is stateless: no ORM, no database. Services that need persistence add it — repository ports in `application/`, ORM entities in `infrastructure/` where the decorators can't contaminate the domain, adapters mapping between the two shapes. The event bus ships as a producer only; consuming is a commented stub in `main.ts` you uncomment when you need it.

And where the design has a real limit, it says so instead of glossing: Redis pub/sub is at-most-once, so if a service needs at-least-once delivery it pairs the publisher with an outbox table and a re-publisher. That's a sentence in the template's own docs. I'd rather inherit an honest limitation I can see than a guarantee I've assumed.

The cost of all of this is real: more files, more indirection, and a `Symbol` for a thing that could have been a class import. On a script it would be absurd. On a service that will be maintained for years, by people who weren't there at the start — and increasingly by tools that were never there at all — I'll take the ceremony in exchange for a rule that can't quietly stop being true.
