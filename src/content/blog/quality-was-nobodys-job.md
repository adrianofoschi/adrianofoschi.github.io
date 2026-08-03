---
title: "Quality was nobody's job, and then it was mine"
description: "Eight years at a software house, four in consulting and four on the company's own product — and two opposite ways of losing the same thing."
pubDate: 'Aug 22 2026'
---

From 2015 to 2023 I worked as a full-stack developer at a software house, and those eight years split cleanly in half. Until 2019 I was in consulting, on projects for clients in banking, insurance and online learning. From 2019 on I worked on the company's own product, a B2B SaaS — with some overlap in the middle, the way these transitions actually go rather than the way an org chart draws them.

I expected the second half to be the better one. It was, in the ways I hoped for and in a couple I hadn't thought about. But the thing I actually learned from having done both is stranger than that: quality can be lost from either side, and the two sides lose it for opposite reasons.

Everything below is what I saw, in the rooms I was in, on the projects I worked on. I'm not describing an industry. I'm describing eight years of my own working life.

## Being the vendor

Consulting has a shape that took me a while to see clearly. You are the vendor. You work on a system that isn't yours, inside decisions that were made before you arrived, by people you often never meet. You are paid to deliver an agreed scope by an agreed date, and that sentence isn't a caricature — it is, quite precisely, the definition of done. Everything else is goodwill.

Almost all of it was work on software that already existed. Banks and insurers with large internal IT departments, their own architects, their own standards documents, their own way of doing things settled years before I showed up — and a system already running, already carrying the business, already the way it was. Often the work reached me through subcontracting, another supplier's contract rather than the client's own, but that's a detail of my situation and not the thing that mattered. You are not brought in to have opinions. You're brought in because there's more work than there are people, and the work has a defined edge.

Inside that, the work was real and often demanding: design, development and release, in Scrum teams and in the release processes regulated sectors require. Environments you can't touch directly. Deployments with a window and a sign-off. Documentation that exists for an auditor rather than for a developer. I got good at working inside those constraints, and that turned out to be a transferable skill.

## Nothing moved

What I remember most, though, isn't a system or a release. It's how little anything moved.

In the projects I worked on, technology choices were effectively closed. Not defended — closed. A thing was done a certain way because it had always been done that way, and proposing a different way had nowhere to land: there was no meeting where that proposal belonged, no one whose job it was to receive it, no budget line it could be attached to. Those questions belonged to the client's own architects, and they had been answered years earlier. Even the risks were stable. You could see something that was going to hurt eventually, say so, and watch the observation get filed. Not rejected. Filed.

I don't think that was bad luck in the accounts I happened to land on. Every piece of consulting I did on existing software looked like this, and it reads as structural to me rather than accidental: when the software is already there and it belongs to someone else, resistance to changing it is the default state, and low quality is what years of that default leave behind.

And nobody talked about it. That's the part that stayed with me. There was a silence around quality that wasn't cynicism exactly — it was closer to agreement. If a thing had shipped and nothing had caught fire, the thing was fine. Nobody was measured on whether the code would still be workable in three years, because in three years it would be somebody else's problem, quite possibly a different vendor's. Quality wasn't a requirement that had been considered and traded away against cost. It just wasn't a requirement.

## It wasn't all like that

Alongside the large engagements there was a steady stream of much smaller projects, for clients who came once and might never come back. On those I wasn't only writing code — I ran them, from the first conversation to the delivered thing. I sat with the client myself, with nobody in between. I did the functional analysis and then the technical one, which on a small project is the same person working out what someone needs and then deciding how to build it, with nothing in between the two but a weekend. I estimated the work, and then had to defend the estimate when the work turned out to be what it really was rather than what I'd guessed. I coordinated other developers, which is a different job from doing the work yourself and took me a while to be any good at. And the technical choices were mine — along with the responsibility for them, which is the half of that sentence people tend to leave out.

These were ad-hoc solutions, built for one client's actual situation rather than fitted into an existing estate. There was no architecture to inherit and nobody to ask for permission, which is exhilarating for about a week and then becomes the realisation that if this turns out badly there is no one else it can be attributed to.

That's the part worth noticing, because it's the exact inverse of everything above — same years, same employer, same person. Nothing about me was different. What was different was that there was no existing system to be careful with. Nothing had been decided yet, because there was nothing there yet — no estate, no accumulated process, no decade of other people's choices to work around. On those projects a better idea could be tried on a Tuesday and be in production by Thursday, and if it turned out to be a bad idea that was mine too.

I learned more per month on those than on the large accounts, and I've never quite decided whether that says something flattering about small projects or something bleak about big ones.

## The part that isn't stupidity

It would be easy, and wrong, to write the large accounts as a story about people who didn't care.

In a bank or an insurer, the cost of a bad release is not an apologetic changelog entry. It's money that moved when it shouldn't have, a regulator's question you have to answer in writing, a policy that got priced wrong at scale. The systems are frequently older than the teams maintaining them, and nobody left in the building has the whole picture. Under those conditions, "don't touch what works" is not laziness. It's the rational policy, release by release, every single time.

The trouble is what the rational policy adds up to. Risk aversion that's correct on any given Tuesday becomes, over years, an environment where nothing is ever improved, only extended — and where quality, having never been anyone's responsibility, is never anyone's achievement either. For someone who wants to experiment, to try a better approach and see if it holds, that's a ceiling you hit early and then keep hitting. I hit it.

## Same building, different job

Moving onto the company's own product in 2019 changed three things, and none of them was the technology.

The first: technical decisions were suddenly available. Not automatically won — available. There was somewhere for a proposal to go and someone whose problem it was, which meant that arguing for a better approach became a normal part of the work instead of a category error.

The second: consequences came back. Code I wrote badly, I met again six months later, and so did everyone around me. This is the real difference between working on a product and working on a project, and it doesn't take long to feel. Quality stops being a line item in an estimate someone else signs off on and becomes a thing you will personally pay for or personally benefit from, on a schedule you can't predict.

The third: the time horizon. A project ends. A product continues — which means refactoring, debt you carry deliberately, migrations, maintenance that never has a final release. You start thinking in years because the system will be there in years, and you will probably be there with it.

## The opposite failure

Here's what I didn't expect. The problem with an internal product isn't the one consulting has. It's the mirror image.

In consulting, the roadmap is a contract and it barely bends. On your own product it bends constantly, and it bends for good reasons: a customer asks, a deal depends on it, an opportunity appears this quarter and not next. Each individual bend is defensible. What's at risk is the medium and long term — the direction you'd set when you were thinking clearly, which nobody ever cancels, it just keeps getting deferred by a series of reasonable decisions. Losing the compass doesn't feel like a decision at all. That's what makes it hard to notice, and harder to argue against, because there's no single moment to point at.

So: too rigid on one side, where nothing moves and quality is nobody's job. Too fluid on the other, where everything moves and the long term is what quietly gets spent. Neither side gives you quality for free. They just fail differently, and I got to see both failures from the inside within the same eight years, at the same desk.

What I took from the first half is the discipline: scoping honestly, delivering what was agreed, working inside constraints I didn't choose, and reading an organisation well enough to know what could actually change and what couldn't. The small projects added responsibility to that, but responsibility of a kind that ends — you own the thing completely, and then it ships and it's gone, and whatever you got wrong is somebody else's inheritance. What I took from the second half is harder to put on a CV — the understanding that owning the consequences is the only mechanism that makes quality matter to anyone, and that it isn't sufficient on its own.

There's a coda to this, and it's the reason I've thought about it so much. Years later, the technical direction of that same product became my responsibility. The compass problem I'd watched from a developer's seat turned into the thing I answer for. It's a fair outcome, and an uncomfortable one: I can no longer file the observation.
