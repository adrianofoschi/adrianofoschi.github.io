---
title: "The cost of writing collapsed. The cost of checking didn't"
description: "Obrussa is an approach I'm trying right now: treating AI-assisted development as a system problem — explicit context, a blocking gate, durable state — because the bottleneck moved from producing code to verifying it."
pubDate: 'Aug 26 2026'
tags: ["ai", "architecture"]
---

This is an approach I started building in 2026 and am still in the middle of. It has no results to report yet — no before-and-after numbers, no verdict. I'm writing it down because the reasoning behind it is the part I'd want to read from someone else, and because committing to it in public makes it harder for me to quietly move the goalposts later.

The short version: getting an AI agent to write code well is not mainly a prompting problem. The leverage isn't in the prompt. It's in the system that decides what the agent works on, what gate verifies the result, and what state survives between one run and the next. So instead of collecting prompting tricks, I've been building the system.

## The asymmetry that motivates all of it

Producing code has become dramatically cheap. Checking it has not.

That sentence is the whole argument, so it's worth being precise about why the second half is true. A model can hand me a coherent 400-line change in under a minute. Reading that change properly costs me exactly what it cost before — arguably more, because the failure mode has changed. Obviously-wrong code announces itself. Plausible-but-wrong code doesn't: it compiles, it reads like something a competent person wrote, it passes the tests that exist, and it's wrong in a way that requires knowing the intent to see. Volume went up, and the per-unit cost of verification went up with it.

So the bottleneck moved. The scarce resource is no longer typing, it's attention — and attention doesn't scale by adding agents. If the cost of production drops by an order of magnitude and the cost of verification doesn't, then verification is where the whole thing either works or quietly fails.

There's an obvious move here that doesn't work: have a second agent review the first one's code. I use maker/checker separation, but on its own, without an objective check underneath it, that arrangement is two optimists agreeing with each other. The model that wrote the code is a lenient judge of it, and a second model with no fixed standard to check against tends to find the work acceptable too. Agreement is not verification.

The practical consequence is that **"done" has to be measurable rather than a judgement**. Which means as much verification as possible has to stop being an act of reading and become an act of running.

## Introducing Obrussa

**[Obrussa](https://github.com/adrianofoschi/obrussa)** is what I call the repository where all of this lives, and it's public — MIT, so the template can be copied into anything, including closed source. The word is Latin, from the Greek *obryza*: the assaying of gold by fire. *Aurum ad obrussam* is gold refined to the highest purity, and Seneca uses *ad obrussam* figuratively for something that has been put to the test and proved genuine. It seemed like the right name for a system whose entire job is telling apart what is correct from what merely looks correct.

Obrussa contains no product code at all. It holds the decisions, the standards and the templates that every project of mine inherits: architecture decision records covering the framework itself, a document on how to keep many repositories aligned without duplicating or contradicting each other, and a service template — the skeleton a new repo starts from, carrying a deliberately thin context file, the gate specification, a state file, a contract, and an empty skills folder waiting to be earned.

At the top of it sits the principle everything else is derived from: the leverage is no longer in the prompt, it's in the system that decides what the agent works on, what gate verifies the result, and what state survives between runs. Everything below is what that turns into when you make it concrete.

## The gate of substance

Tests check what you thought to check. That covers *form*: the code compiles, the happy path works, the cases someone imagined are covered. What tests systematically miss is *substance*:

- security that isn't a functional bug — missing authorisation, an injection point where the happy path passes cleanly, careless secret handling;
- contradictions between modules — A assumes X, B assumes not-X, and each passes its own tests;
- code that is internally coherent and wrong with respect to the intent.

Substance bugs don't announce themselves per-change. They accumulate invisibly and then surface together, late, which is the most expensive moment possible. So Obrussa's first decision is a **gate of substance** in CI: blocking, four levels.

1. **Form** — strict type-check, lint, format, build, unit and e2e tests.
2. **Security** — SAST, dependency scanning, secret scanning.
3. **Coherence** — architecture fitness functions that check the module boundaries the architecture document claims exist; consumer/provider contract tests; property-based tests on domain invariants where they earn their keep; and types designed so illegal states can't be represented in the first place.
4. **Licensing** — SPDX headers, license and SBOM scanning that knows which direction a dependency may flow, for projects that have a licence boundary.

Maker/checker sits *above* that, not instead of it: an agent implements, then a review pass by a different model checks the change against the threat model and the domain document. The objective gate runs first and isn't negotiable, so the review pass argues about substance rather than about formatting.

The point of the four levels isn't thoroughness for its own sake. It's converting as much substance as possible into form — into something CI can fail. What CI fails, nobody has to notice.

## The number that decides whether this works

The metric I'm tracking is **cost per accepted change**: what it takes, end to end including my own review time, to get one change actually merged. Not lines produced, not tokens spent, not how impressive the diff looked.

That number is also the falsification condition, which matters to me more than Obrussa does. Below a certain acceptance rate, AI leverage is negative — you're paying in review attention more than you're saving in production. If that's where the number lands, the honest response is to say so rather than to keep adding process. I'd rather have a metric that can tell me I'm wrong than a conviction that can't.

And there is an irreducible share of human judgement that no gate absorbs. I handle it by risk-tiering rather than by pretending: authentication, payments, personal data and security boundaries get read line by line, by me. Everywhere else, the gate plus spot-checks is the deal. That's an explicit trade, and writing it down is what makes it a trade instead of a drift.

## Three kinds of memory, and one that's deferred

The other half of Obrussa is what an agent knows when it starts. Three tiers, separated by cost and by when they load:

- **Always-on context** — vision, architecture, domain, threat model, and the repo's `CLAUDE.md`. This describes *what the system is*. It loads every session, so it's paid for in tokens every session, so it has to stay thin.
- **Skills** — a procedure for something recurring, loaded on demand, able to carry scripts and reference material. This is where repeatable know-how goes precisely so it doesn't bloat the always-on context.
- **Dynamic state** — a `STATE.md` saying where the work currently is, updated as slices land.

The rule that keeps them apart: if it's *always true about the project*, it belongs in context; if it's *how you do X when you need X*, it belongs in a skill. Putting procedures in the always-on file is the token waste to avoid.

One thing I deliberately left out: a vector store. Product memory (RAG over a corpus) and coding-agent memory are different problems, and for the second one the codebase plus git plus native search already is the semantic memory. Adding retrieval infrastructure here would be solving a problem I don't have.

Skills are also deliberately deferred. The empty `skills/` folder ships in the template with a candidates file next to it, and nothing gets promoted into a skill until at least one manual run of that procedure has proved reliable. A skill written before that is an unverified hypothesis with the authority of documentation — it crystallises a convention nobody has tested. Order matters: foundations, then the gate, then the template, then a first service built in vertical slices under the gate, then skills extracted from whatever actually held.

## Many repos, and the context you give up

The layout I use is hub and spoke: one private repo holding system-level documents, standards, versioned contracts and a service catalogue, plus one repo per service. That buys clean licence and visibility boundaries and costs something specific: an agent working in one repo cannot see the others. It will happily make an assumption about a neighbour that used to be true.

The substitute for the unified context you gave up is contracts published as versioned artefacts, with consumer/provider contract tests in the gate. That's the machine-checkable replacement — it doesn't inform the agent, it *fails* when the agent gets it wrong, which is the same outcome one step later. And the tedious job of keeping N repos on the same version of shared conventions is repetitive and machine-checkable, which makes it the honest place for an automated maintenance loop: a bot opening pull requests across repos when the standards change. Loops earn their place there, in maintenance, not in greenfield work where nobody can say what "correct" means yet.

## Where Obrussa actually stands

Today it is a boilerplate and a set of decisions, being applied for the first time. The parts I believe most are the asymmetry argument and the insistence that "done" be measurable — those hold regardless of tooling. The part I'm least sure about is proportion: whether a solo developer can carry four levels of gate plus contract tests plus a review pass without the ceremony eating the gain it was supposed to protect. That's exactly what cost per accepted change is there to answer, and it's a number I don't have yet.

What I'm confident about is the shape of the problem. When producing a change becomes nearly free and verifying it doesn't, everything that matters moves to the verification side. Prompting better doesn't touch that. Building a system where correctness is checked by something that never gets tired, and where human attention is spent deliberately on the parts that deserve it, might.
