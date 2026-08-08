---
title: "A prediction game with no fees, and the server that keeps time for it"
description: "A prediction game only works if a one-dollar bet is worth placing, which rules out any chain that charges fees. Koinos charges none — but it also has no oracle, so the clock and the price come from a server I wrote, and that server is the trust model."
pubDate: 'Jun 11 2024'
updatedDate: 'Feb 18 2025'
tags: ["blockchain"]
---

Prediction games have been popular for a while now. The format is always the same: you bet on how something will turn out, and whoever gets it right splits the money of whoever got it wrong. It works because it asks you to know nothing about finance, only to have an opinion about where a price is going over the next few hours.

What I built is the minimal version. A round opens on a currency pair. You put some tokens on **long** or **short**. Betting closes, the round runs, and at the end the price is compared against where it started. The winning side splits the pot; the losing side filled it. It's a prototype, running on testnet, built on [Koinos](https://koinos.io/) — a blockchain with no transaction fees.

Fees are the first thing that makes a game like this impossible. On a chain with gas, a one-dollar bet costs more in fees than it can win: the stake has to be big for the toll to be worth paying. Remove the fee and small stakes become possible again, so rounds can be short and casual instead of long and serious.

But the real friction comes earlier, and fees are only its last line. To bet one dollar, someone has to install a wallet, put twelve words somewhere safe, open an account on a centralized exchange, verify their identity, buy the token, work out which network they're buying it on, and send it to their own address. Then they can bet their dollar. Nobody walks that whole road for a game. The chain took the fees away; the rest of the road, this prototype doesn't touch.

![Two phone screens: a pool chooser listing BTC/USD 4h as live with ETH/USD and SOL/USD coming soon, and a betting screen showing the current BTC price, a countdown reading "betting stops in 11m 10s", payout percentages for each side, and Long and Short buttons](../../assets/blog/kuku/prediction-screens.png)
_Choosing a pool, and betting in one. The two payout figures move as money lands on either side._

## The contract was the easy part

The on-chain half is unremarkable, which is the right outcome. A round has a state — open, in progress, closed, or one of two failure states — and users' bets hang off it. Three operations matter: entering by putting money on a side, collecting if you won, taking your stake back when a round can't be settled. Everything else is bookkeeping.

Payouts are pari-mutuel, not fixed odds. There's no house on the other side of your bet: the winners divide what the losers staked, in proportion to what each put in. That's why the two percentages on the betting screen keep moving — they aren't a price the game is offering you, they're the current shape of the pot.

Written and deployed, that's a few hundred lines of AssemblyScript. And it does nothing at all, forever, because of two things a blockchain cannot do.

## Koinos has no oracle

An oracle is the piece that connects a blockchain to the world outside, and it's needed for two distinct things that often get conflated.

The first is time. Nothing happens on a blockchain unless someone sends a transaction: there's no scheduler, no cron. A contract reacts, it never acts. So "betting closes in eleven minutes" isn't something the contract can enforce by itself — somebody has to show up at the right moment and tell it to change state: open the next round, close betting on this one, settle that one.

The second is facts. A contract can't go and read the price of Bitcoin: it has no network access, and it must not have any. Every node executing that transaction has to arrive at an identical result, and two nodes calling an API a second apart would not. Determinism is the basis of consensus, and reaching outside is how you break it. So the price has to be handed to the contract from outside.

On bigger chains this service already exists as infrastructure in its own right, shared by whoever needs it. On Koinos it doesn't. So I implemented it: an external server that reads the state of the current round, works out which transition is due, asks [Coinbase's public API](https://docs.cdp.coinbase.com/exchange/reference/exchangerestapi_getproductticker) for the pair's rate, and sends the transaction that moves the round forward, carrying the price along as an argument.

```d2 title="One round transition: the server reads the contract state, works out which transition is due, asks Coinbase for the pair's rate, and sends the transaction that moves the round on with the price carried as an argument"
shape: sequence_diagram

server: "my server"
contract: "the game contract"
coinbase: "Coinbase public API"

server -> contract: read the current round
contract -> server: state
server -> server: which transition is due?
server -> coinbase: the pair's rate
coinbase -> server: price
server -> contract: "open / close / settle,\nprice as an argument"
```

*The rules sit in the contract and nobody can change them. The clock and the price arrive from
one process, one key and one exchange's endpoint — which is where the trust actually sits.*

## The server is a point of trust

The rules of the game are on chain and nobody can change them. The clock and the price are not. If the server stops, rounds hang; if it gets the price wrong, or lies about it, the round closes badly and the chain records the result without asking questions. This isn't trustless: the stakes are held by a contract nobody can rewrite, but settlement depends on one process, one key, and one exchange's public endpoint.

The correct solution is an oracle network: several independent reporters, staked, penalised for disagreeing. That's an order of magnitude more work than the game itself, and it doesn't fit inside a prototype.

What does fit is making sure that when something goes wrong, the money comes back. That's why a round has two failure states next to the successful one: if the server doesn't return, if one side has no players, if something doesn't add up, the round is marked skipped or suspended rather than closed, and the refund opens. Nobody loses a stake to an event that didn't happen properly.

## Mana: measuring the limit rather than guessing it

Koinos charges no fees: it meters transactions with mana, a regenerating budget, and before sending one you have to declare how much it may consume. Estimate too low and the transaction fails, too high and you tie up more than you need.

So the server sends everything twice: first as a trial run that isn't broadcast, purely to read back how much it actually consumed, then for real with that figure plus ten percent. The limit is measured rather than guessed.

What I take away from this project is a question. When someone shows me a decentralized application, I don't ask whether it's decentralized — almost none of them are, if you're strict about it. I ask which parts aren't, and what those parts can do to me on their worst day. Usually there are more of them than the pitch lets on, and almost nobody has thought about the refund.

## Update — February 2025

Since writing this I've started building Sovrano, a smart-account wallet you sign into with an account you already have, with no twelve words to keep safe. That's where a game like this one should live. The missing piece isn't the contract: it's everything that comes before it — installing a wallet, opening an exchange account, verifying your identity, buying the token, sending it to yourself. The goal is to bring the purchase inside the wallet too, so that between wanting to bet a dollar and having bet it there's nothing left in the way. I'm not there yet.

The other direction is the game itself. Right now it can do one thing: compare a pair's price against where it started. But the contract doesn't need to know it's looking at a price — it needs an event with a date and an outcome, reported from outside. Making it agnostic about the type of event means being able to open rounds on a match, on a vote, on anything with a verifiable result: what changes is who brings the result in, not the rest.
