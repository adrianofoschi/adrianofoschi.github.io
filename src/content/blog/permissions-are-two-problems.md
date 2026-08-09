---
title: 'Permissions are two problems, not one'
description: "Every authorization engine I've tried answers \"can this user see this?\" beautifully, and \"what can this user see?\" badly. That second question is where I keep getting stuck."
pubDate: 'Aug 8 2026'
tags: ["architecture"]
heroImage: "../../assets/blog/permissions/hero.png"
heroAlt: "The logos of the three authorization services discussed in the post: OpenFGA, Permify and Permit.io"
---

Open GitHub and the first thing in front of you is a list of repositories: the ones you can see. It looks like the most ordinary screen in the product, and it's actually the point where the permission system has to do the hardest thing you can ask of it.

Because the question that page answers isn't "can this user see this repository?", it's "which repositories can this user see?". Put that way it sounds like the same question turned around. For whoever implements it, it isn't remotely the same: in the first case you have two concrete things in front of you, a user and an object, and you only have to decide yes or no. In the second you're holding the user alone, and the set of possible answers is everything that exists in the system.

There's also the fact that the path making a repository visible is almost never written on the repository. You can see it because you're a member of an organization that grants a base level of access across all its repositories; because you belong to a team the repository was granted to; because you belong to a team that is a child of that team, and access is inherited downwards; or because someone added you as a collaborator on that single repository and nothing else. Visibility is the result of inherited rules applied across several levels, and none of those levels, taken on its own, can tell you what is visible.

This way of deciding access has a name: **ReBAC**, relationship-based access control. What sets it apart from the more familiar models is where the information lives. Under RBAC a permission is a property of the user: you hold a role, and the role carries capabilities with it. Under ABAC it's the outcome of comparing attributes — the user's department, the document's classification. Under ReBAC it's neither: it's a consequence of how entities are connected to each other. Nowhere is it written that you can see that repository. You can see it because a chain of relationships leads you there, and to know that, someone has to walk it.

I'm currently dealing with two systems that approach this problem from opposite directions. Neither of them gives me an answer I'm happy with.

## The engine that does everything

The first is a product where granular permissions aren't an architectural indulgence: they're a real requirement, and it comes from customers. Saying who is an administrator and who isn't doesn't cover it — you have to be able to express who sees what down to the single entity, with delegations, exceptions, and visibility that is inherited along the organizational structure and sometimes has to stop at a given level.

We answered that requirement by building a model of our own. That one is ReBAC in substance too, even though we never called it that: an entity's visibility depends on how it is connected to the structure, not on a label it carries. And the result is an engine that can express anything. It's genuinely powerful: whatever access policy gets asked for, the configuration that produces it exists.

Manageability pays the bill. Years of successive rewrites — each of which solved a real problem and left a layer behind it — have spread the logic that decides an access across too many places at once. When a bug shows up, and they do, the hard part isn't fixing it: it's working out where that decision was made. Nobody holds the whole system in their head, and it isn't a matter of attention: there's no vantage point from which you can look at all of it at once.

The diagnosis I've settled on is that we wrote ourselves an authorization language without being a company that makes authorization. Every new requirement was answered by making the engine more expressive, because that's the natural thing to do when the engine is yours. But expressiveness is exactly what you pay for later in maintenance: the more things a system can say, the less it's possible to look at it and know what it is saying.

## Outsourcing what isn't the core business

The second system is a new prototype I'm building from scratch. There I wanted to try the opposite route: if writing your own permission engine is how you end up with a language to maintain, then you take authorization from outside, the way you take email delivery or authentication from outside. It isn't my core business, and there are companies for which it is.

I looked at [Permify](https://permify.co/), [Permit.io](https://www.permit.io/) and [OpenFGA](https://openfga.dev/). The serious experiments I ran on OpenFGA, because it's the reference open-source implementation of the model Google described in [Zanzibar](https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/) — the system that decides access inside Google, and the paper this entire category of products grew out of. If the pattern makes sense, that's where you'll see it.

### What the declarative model gets right

And for a good stretch of the way it makes a great deal of sense. The authorization model is a declarative file: you write the entity types, the relationships between them, and the permissions as expressions over those relationships. The inheritance that in a homegrown engine is code scattered around is a single line there — whoever owns the container has that permission on everything the container holds, written once and true everywhere. That file lives in a repository of its own, with its tests beside it: YAML scenarios saying "this user, this permission, this entity, expected true", running offline, with no database and no application, in a couple of seconds. I wrote sixteen of them, a hundred and twenty assertions, covering the cases nobody in the older system ever dared verify systematically: isolation between separate units, a user with no role at all, an unknown user. I didn't even have to host it: there's a managed service with a free tier, and for a prototype that's enough.

There's also a discipline this separation imposes, and I think it's the right one. Roles stay domain facts in my own database, with their invariants and their events; the external service is a projection, updated by an event handler. Which forces you to decide the order of writes. If the relationship is a domain fact, database first and service second: if the second step fails, the fact exists and the permissions arrive late, and that's an annoyance. In the reverse order, if the database fails, you're left with granted permissions that no longer have any fact behind them — and that isn't an annoyance, it's a hole.

So far the experiment is a success, and that deserves saying before I get to how it ended.

## Then comes the list

Then comes the moment you have to build the page that lists things. It isn't an edge case: it's the first screen anyone who logs in sees, exactly as on GitHub. And there you discover that the service you delegated authorization to answers beautifully the question you ask about one object at a time, and very badly the one you have to ask about all of them.

There are two routes, and I tried both. The first is to filter afterwards: you query the database with your normal filters and your normal pagination, take the identifiers of the page you got back, send them to the service in bulk asking which of these the user can see, and throw the rest away. It works, in the sense that the result is correct. Except that the total count you show at the bottom of the list is the one from before the filter, so it's a lie; and a page of twenty-five items reaches the user holding whatever survived. For someone with access to nearly everything the difference doesn't show. For a user with access to a small slice — which is the common case, not the exception — two or three of the twenty-five remain, and pagination simply stops working: you'd have to keep asking for pages until you managed to fill one.

### Filtering first, and the list that arrives whole

The second route is to filter first: you ask the service for the list of objects the user holds that permission on, and hand it to the database. Here the problem is that the list arrives whole. There's no real pagination to draw twenty-five from: it gives you all of them, and you have to feed them into a clause enumerating thousands of identifiers, then sort and paginate downstream. At small numbers it's a solution. At real numbers it's a query nobody wants in production.

Against this objection there's an encouraging figure in circulation, a public case study reporting a page that went from ten seconds to four hundred milliseconds with this approach. I read it carefully because I wanted it to be true, and it doesn't say what it appears to say: the bulk filter accounts for a factor of two, eight seconds to four. The big jump comes from something else — moving the database into the same region as the service. That's a networking fix, not an answer to the problem.

## The materialization deadlock

At this point there's only one obvious move, and it's the one everybody makes: if you can't filter at runtime, you build a local index. A table in your own database saying, for each user, what they can see. From there on the list goes back to being an ordinary query, with its pagination and its count, because the filter has become a JOIN.

The problem is how you fill that table. What you need are the *computed* permissions — "this user can see this object" — and the external service doesn't give you those. It has an API for following changes, but it returns relationships, that is, the facts you wrote into it: that you're a member of that team, that the team has access to that repository. That's data you already have. The interesting part is what the engine derives by walking the graph, and that part it keeps to itself: it computes it to answer one question, then discards it.

To get it out you have to ask, and asking means one question per object. Thousands of questions per user, to be redone every time anything changes anywhere along the chain. It's the same wall as before, moved inside the synchronization process.

### Where each service stops

Permify has the better API on this front — a reverse lookup starting from the subject's relationships, with cursor pagination and a streaming variant — and for a moment it looks like the answer. But it returns the objects of one type at a time, and a complete index wants all of them: the organizations, then the repositories of those organizations, then what lives inside those repositories. The cardinality explodes the same way. The mechanism changes, the bottleneck doesn't.

Permit.io is the only one attacking the problem at the root: partial evaluation of the policy, which instead of a list of identifiers hands you a clause to drop into a `WHERE`. That's exactly the right thing. Only, for Postgres it's in early access, it works for attribute-based policies rather than relationship-based ones — that is, not for the model I have — and it requires writing the rules in a separate language. Mature materialization does exist, but as commercial products in early access, or on stacks that aren't mine.

```d2 title="Four independent paths by which a user can reach a repository: organization membership granting a base permission, a grant to a team, inheritance from a parent team, and a direct collaborator grant on a single repo"
direction: down

user: "@user"
org: "organization"
team: "team"
subteam: "child team"
repo_a: "repo A"
repo_b: "repo B"
repo_n: "repo … × thousands"

user -> subteam: "member of"
subteam -> team: "inherits access"
team -> repo_a: "granted to team"

user -> org: "member of"
org -> repo_a: "base permission"
org -> repo_n: "base permission"

user -> repo_b: "collaborator"
```

_Every arrow leaving `@user` is a different path to the same kind of object. To answer "can they see repo A?" one path reaching the destination is enough. To answer "which repositories can they see?" the walk has to be repeated for every repository that exists — and none of the repositories knows it is reachable._

## The limit is structural, not an implementation detail

Lined up together, every attempt fails at the same point, and it's a point that doesn't depend on the product I picked. Filtering downstream breaks counts and pagination. Filtering upstream doesn't compose with SQL. The local index needs computed permissions the engine doesn't expose. Generating SQL clauses, which would be the right answer, only exists for a policy model different from mine. Changing tools changes the name of the API, not the outcome.

The reason lies in the shape of the problem itself. These engines answer by walking a graph from a point: give me a user and an object, and I'll find whether a path joins them. It's a targeted operation and that's why it's extremely fast, milliseconds. The inverse question isn't the same operation reversed: it's the same operation repeated for every candidate object, because there's nowhere that records which objects are reachable. Which is, incidentally, exactly the thing that makes ReBAC convenient — visibility isn't a label on anything, it's a consequence — seen from the other side.

That's where, for me, the experiment closes. Inside those systems there's logic that knows how to answer the right question, and it's powerful, declarative, tested by me with a hundred and twenty assertions. But it isn't lendable. There's no way to tell it "apply yourself to everything and tell me what comes out" in a form I can put in a `WHERE`. So, to get the list, that logic is something I have to rewrite: in my database, in my language, from scratch.

And if I write the same rule twice in two different places, those two definitions have to stay in agreement forever. The worse part is which of the two actually counts: the copy, the one I rewrote, is what decides what people see on screen. The original only guards the writes. If they drift apart nobody notices, because a wrong list doesn't raise an error — it just has one row too few, or one too many.

## Giving up, and going back to Postgres

In the prototype I removed the external service and put authorization inside Postgres, as native functions. It wasn't the conclusion I wanted — the stated goal was to stop writing myself a permission engine at home — but between two copies of the same rule and a single copy, the single copy wins.

The functions come in two families. One for point checks, one per write operation that needs authorizing: they take the user and whatever they're acting on, and answer true or false. The other for filtering: they take the user and return a set of identifiers, the ones they're allowed to see. Translated into the vocabulary of the earlier example, the list of repositories becomes this:

```sql
SELECT r.*
FROM repositories r
WHERE r.id IN (SELECT authorized_repositories(:user_id))
  AND r.archived = false
ORDER BY r.pushed_at DESC
LIMIT 25 OFFSET 0;
```

Which is the thing I'd been looking for from the start: a subquery like any other, composing with the filters that were already there, with the sort and with the pagination. The total count is an ordinary `COUNT(*)` and it tells the truth. Check and filter read the same data in the same transaction, so there's no window in which permissions lag behind facts — because there's nothing to synchronize, there's no second place.

The move cost less than expected, for a reason worth stating: the application had never known about the external service. Use cases called a port with a deliberately generic signature — user, permission, context — and behind that port sat an adapter. Replacing it with one that runs the SQL functions didn't require touching any application logic.

And what convinces me most is how it grows. If tomorrow I need a permission that doesn't flow through the structure but is granted directly on a single entity, you add an assignment table, an `OR` clause in the check function and the same clause in the filtering one. One more level of granularity costs three changes, always the same three, and they're SQL. Linear growth, rather than an engine that gets a little more expressive every time.

### Three open problems, and the last one is serious

That said, I don't want to make it look like a clean solution, because it has three open problems and I consider the last one serious.

The first is that I don't know how far it holds. The functions run, and on the prototype they're instant — but a prototype doesn't carry a real customer's data volume, and I haven't measured anything under load yet. At some point a filter recomputed on every query will stop being free, and I don't know where that point is. Finding it is the next thing to do: until I have, everything above is a decision made on reasonable grounds, not on measurements.

The second is what I lost by going back inside the database. The declarative model was readable: one file, the types, the relationships, the permissions as expressions over those relationships. And its tests ran in two seconds with nothing running, a hundred and twenty assertions stating in black and white who sees what. Now the access policy is code inside the database, versioned through migrations and verifiable only against a live database. It works better and it's harder to look at. It's a trade I made deliberately, but it's still a trade.

The third is the paradox this whole story runs into. The prototype can afford native functions because its model is simple: a few roles, a few dozen combinations, a two-level hierarchy. If it grew as complex as the other product's, this decision would have to be re-evaluated from scratch — meaning I'd find myself exactly where I started, with homegrown authorization logic that widens with every requirement. The simple system can do without an external engine, and indeed it just got rid of one. The complex system, the one that would genuinely benefit from an external engine, is precisely the one that gets least out of it: it has the deepest hierarchies, the longest lists and the largest volumes, which are exactly the three things these tools don't help with. Whoever can afford them doesn't need them; whoever needs them can't afford them.

## The compromise: making the question smaller

Then there's a third possibility, one I haven't taken all the way yet but that I'm coming round to — and that I suspect is what everyone does without writing it down anywhere. It doesn't consist of answering the hard question better. It consists of never asking it in that form.

Seen from the outside, the screen that lists *everything* a user can see doesn't exist, in any product. GitHub shows you an account's repositories, or an organization's; search works within a scope. There is no page promising the complete set of what you have access to, sorted by date. If that page doesn't exist, maybe it's because nobody ever wanted it enough to pay for it — and I was treating it as a requirement only because it's easy to state.

Technically this changes one thing, but it changes all of it. If every query carries a mandatory scope — this organization, this owner, this period — the candidate set stops being "everything that exists" and becomes a number I can bound contractually. And if that number is small enough, downstream filtering becomes viable again: I don't filter a page, I filter the whole set and paginate *after*. The count is computed over the survivors, so it's true, and the pages are full. What didn't work in the earlier section wasn't filtering afterwards: it was filtering after having already paginated.

### What the scope constraint costs

The price is honest and worth stating. It's a product constraint dressed as a technical decision, and it holds only as long as I control the surface: a generic query API is something I couldn't afford. I lose exactly the questions that have no scope — global search, exporting everything a user can see, cross-cutting counters of the "you have forty-seven items expiring" sort. The bound on candidates has to be guaranteed rather than hoped for, because the customer with the twenty-thousand-object organization does eventually turn up, and you need a hard limit with defined behaviour for when it's crossed. And on every request I pay for a bulk check across the whole scope: latency, and on a metered service a line item too.

The fact remains that this isn't an answer to the question: it's a negotiated surrender, making the question small enough that the tool I have can handle it. And the longer I look at it, the less it feels like a defeat. "Which repositories can user X see" isn't a question that arises from a need — it arises from how we designed the screen. The real need is always narrower: which repositories in this organization, which ones touched recently, which ones match what I'm searching for right now. And narrower questions are ones the tools I tried answer extremely well.

I'm not there yet. Today the prototype filters in SQL, and for what it has to do that's fine. But if I had to bet on where the answer lies, I wouldn't bet on an engine that learns to answer the big question. I'd bet on no longer needing to ask it.
