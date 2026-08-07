---
title: "A blockchain can't tell the time: the off-chain half of an on-chain game"
description: "I built a price-prediction game where the smart contract was the easy part. Everything that made it a game — knowing when a round ends, knowing what the price was — had to live on a server, and that server was the whole trust model."
pubDate: 'Jun 11 2024'
tags: ["blockchain"]
---

The game is as simple as they come. A round opens on a currency pair. You put some tokens on **long** or **short**. Betting closes, the round runs, and at the end the price is compared against where it started. The winning side splits the pot; the losing side funds it.

It wasn't my idea. This was commissioned work — someone else's product, which I designed and built in 2024 on [Koinos](https://koinos.io/), a blockchain with no transaction fees.

That last detail is the only reason a game like this is worth building at all. On a chain with gas, a one-dollar bet costs more in fees than it can win. Remove the fee and small stakes become possible, so rounds can be short and casual instead of large and serious.

![Two phone screens: a pool chooser listing BTC/USD 4h as live with ETH/USD and SOL/USD coming soon, and a betting screen showing the current BTC price, a countdown reading "betting stops in 11m 10s", payout percentages for each side, and Long and Short buttons](../../assets/blog/kuku/prediction-screens.png)
_Choosing a pool, and betting in one. The two payout figures move as money lands on either side._

## The contract was the easy part

The on-chain half is unremarkable, which is the correct outcome. A pool has a state — open, in progress, closed, or one of two failure states — and users have entries against it. Three methods matter: `entry` puts money in and takes a side, `reward` pays out to a winner, `refund` returns a stake when a round can't be settled. Everything else is storage layout and bookkeeping.

The payouts are pari-mutuel, not fixed odds. There's no house taking the other side of your bet: winners divide what losers staked, in proportion to what they put in. That's why the two percentages on the betting screen keep moving — they aren't a price the game is offering, they're the current shape of the pot.

Written and deployed, that's a few hundred lines of AssemblyScript. And it does nothing at all, forever, because of two things a blockchain cannot do.

## It can't wake up

Nothing happens on a blockchain unless someone sends a transaction. There is no scheduler, no cron, no `setTimeout`. A contract is a thing that reacts; it never acts.

So "betting closes in eleven minutes" is not something the contract can enforce by itself. Somebody has to show up at the right moment and tell it to change state — open the next round, lock this one, settle that one.

## It can't look anything up

A contract also can't fetch the price of Bitcoin. It has no network access, and it must not have any: every node executing the transaction has to reach an identical result, and two nodes calling an API a second apart would not. Determinism is the whole basis of consensus, and reaching outside is how you break it.

So the price can't be read by the contract. It has to be handed to it.

## Which means: a server with a private key

Both gaps are filled by the same small service. It reads the current pool's state, works out which transition is due, fetches the pair's rate from Coinbase's public API, and submits the transaction that moves the round forward — carrying the price with it as an argument.

That is the honest architecture of a great many "decentralized" applications, and it deserves to be said plainly rather than buried under the word *dapp*. The rules of the game are on chain, verifiable, and can't be quietly altered. The clock and the facts are not. If that server stops, rounds hang. If it lies about the price, the game is rigged and the chain will happily record the theft, permanently and with excellent auditability.

Calling that trustless would be a lie. The stakes are custodied by a contract nobody can rewrite, which is real — but the settlement depends on one process, holding one key, trusting one exchange's public endpoint.

## What you can do about it alone

The grown-up answer is an oracle network: multiple independent reporters, staked, penalised for disagreeing. That's a serious project in its own right, an order of magnitude more work than the game, and it was never going to fit inside a commissioned build on a small chain. Which is the ordinary situation: the correct architecture exists, it's documented, and it costs more than the thing you were hired to make.

What you can do instead is make sure the failure mode is *refund*, not *loss*. That's why the pool state machine has two failure states next to the successful one. A round that can't be settled — the reporter never came back, one side has no players, something is visibly wrong — is marked skipped or suspended rather than closed, and the `refund` path opens so every entry can pull its own stake back out. Nobody's money is decided by an event that didn't happen properly.

It doesn't make the design trustless. It makes the centralized component *fail safe* instead of failing expensive, which is the difference between a system that can disappoint you and one that can rob you. If you can't remove the trusted party, at least make sure the worst thing they can do by breaking is give everyone their money back.

## The mana detail

One thing worth stealing regardless of the subject. Koinos doesn't charge fees; it meters transactions with mana, a regenerating budget, and you declare how much a transaction may consume before you send it. Guess too low and it fails, too high and you tie up more than you need.

So the service submits everything twice. First as a dry run that isn't broadcast, purely to read back how much the transaction actually consumed, then for real with that figure plus ten percent. The limit is measured rather than estimated. That trick applies to any resource-metered system where the cost of a call is knowable only by running it.

## Where it ended

It ran on mainnet for a few months: real rounds, real stakes, and a small service somewhere quietly deciding when each one ended. The screenshots above happen to be from a testnet build. The chain the whole thing depends on is dormant now, along with the rest of what I built on it.

What stayed with me is a way of reading other people's projects. When someone shows me a decentralized application, the question I ask isn't whether it's decentralized — almost nothing is, once you're strict about it. It's which specific parts aren't, and what those parts can do to me on their worst day. Usually the answer is much more than the pitch implies, and nobody has thought about the refund path at all.
