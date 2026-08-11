---
title: "A migration with no undo, and 2,000 users in three weeks"
description: "In late 2023 I rewrote the data model of a crypto wallet that was already installed on real phones, redesigned its interface, and ran a giveaway that took it past 2,000 active users in three weeks."
pubDate: 'Jan 9 2024'
tags: ["blockchain"]
heroImage: "../../assets/blog/konio-growth/hero-milestone.png"
heroAlt: "The Konio 2.0.0 milestone release card: coin prices, NFT tracker, nickname support, transaction history and a dapps browser listed beside the coins and NFTs screens"
---

By autumn I had a mobile wallet in production. Konio was a native iOS and Android wallet for [Koinos](https://koinos.io/), a blockchain with no transaction fees, and I had written it alone: create or import a wallet from a seed phrase, hold tokens and NFTs, sign for dApps over WalletConnect, in eleven languages.

It worked. The data model underneath it did not, and the next six months went into three things: fixing that, making the app comprehensible, and getting people to use it.

## The data model I had shipped was wrong

Version one stored everything in two blobs. One JSON object in ordinary device storage held settings, accounts, coins and the address book; one encrypted object in the OS keystore held the keys and the password. Accounts carried an array of token contract ids, and those tokens lived in a separate map keyed by contract id alone.

That was exactly the problem. A token isn't a single, global thing: if I had two accounts, each with its own balance of the same token, or the same token on two different networks, to the app they were the exact same entry — because I stored it keyed only by contract id, with no record of which account or which network it belonged to. The result was that two different balances would end up overwriting each other. Every new feature I tried to add, starting with real multi-network support, ran straight into this limit.

In October I rebuilt it from scratch: instead of two big blobs, five separate stores — settings, accounts, secrets, coins, contacts — where every entry carries its own unique identifier. For coins, that identifier was no longer just the contract, but the combination of account, network and contract together: exactly what a balance actually is, in reality — a specific number for a specific account on a specific network.

## Doing that without a server

There was no backend here, no backups, and no undo. The only copy of a user's data was on their phone, and part of that data was the keys to their money. A migration that half-succeeded wouldn't produce a support ticket, it would produce a person locked out of their own funds — permanently, because there's no password reset for a blockchain account.

Four decisions made it survivable, and I'd reuse all of them:

**Migrations were dated, ordered, and committed one at a time.** Each one was a function keyed by a date — `20231003`, `20231004`, and so on — sorted and applied in sequence, with the stored version bumped only after a migration returned successfully. A failure halfway through the chain left the version at the last step that had actually worked, so the next attempt resumed at exactly the right place instead of redoing work already done.

**Failure was loud and blocking.** A dedicated screen gated the app when a migration was pending, and if one threw, it showed the real error text instead of a friendly message. That looked unpolished. It was the right call: the alternative was an app that carried on with half-converted data and let the user act on it.

**Old data got deleted one version later, not in the same step.** The migration that read the v1 blobs didn't remove them. A separate, later migration did. For one release, the original data sat there untouched as a safety net — cheap insurance, paid for in a few kilobytes.

**Small, boring migrations were fine.** Five shipped between October and February. One re-encoded every stored NFT token id to hex. Two just corrected a default value. Keeping them tiny is what made each one easy to reason about, and reasoning about them was the whole job.

## Making the app explain itself

Over the same period I restructured the interface to be clearer at a glance — anonymous icons out, named sections in. The overall UX improved a lot too, especially the send and receive screens, and the whole NFT section.

![The redesigned Konio assets screen: total balance in USD, a mana percentage indicator, a COINS/NFTs toggle, and a list of tokens with balances](../../assets/blog/konio-growth/assets-redesign.png)
_The redesigned main screen. The orange figure under the balance is mana._

The change I cared about most was that small orange percentage. Mana is what makes transactions on Koinos free: it's a resource tied to the tokens you hold, spent when you transact and regenerated over time. Users had no existing mental model for it, and the temptation was to hide it — free should mean the user doesn't have to think about it. Hiding it was worse. Someone whose transaction failed because mana ran low, with nothing on screen having warned them, concluded the app was broken. Showing "42%" and letting them tap through to a fuller explanation treated a real constraint as a real constraint.

## Letting the ecosystem add itself

Three of the repositories weren't code. [`konio-tokenlist`](https://github.com/konio-io/konio-tokenlist), [`konio-dapplist`](https://github.com/konio-io/konio-dapplist) and [`konio-collectionlist`](https://github.com/konio-io/konio-collectionlist) were folders of small JSON files, one per token, dApp or NFT collection, and anyone could add their own with a pull request. A token entry was a contract id, a symbol, a logo, and a price endpoint plus the path to read the number out of the response. A dApp entry was a name, a summary, tags, a URL and an icon.

![Announcement graphic listing four community tokens added to the wallet: $MK, $EGG, $MARS and $OGAS](../../assets/blog/konio-growth/coin-listing.png)
_A listing announcement from January 2024. Each of these arrived as a pull request against a folder of JSON files._

This was self-defense as much as openness. I was one person. Curating an in-app catalog by hand is an unbounded second job that grows exactly as fast as the thing succeeds; reviewing a ten-line JSON pull request takes two minutes. It also meant a project didn't need my attention to appear in the wallet — they needed a text file. By January the app shipped with those lists prefilled, plus push notifications and a discovery feed that read the project's own posts.

## The giveaway

In November I ran an onboarding campaign, and I ran it myself — the code and the marketing were the same person.

It was [announced on 12 November](https://medium.com/@konio_io/announcing-a-koinos-onboarding-giveaway-ec528542d532) and ran from the 21st to the 27th, hosted on [Zealy](https://zealy.io/), where participants complete small tasks to earn entries. The prize pool was over $3,000: a 48-piece NFT collection I wrote a smart contract for, KOIN, tokens contributed by partner projects, and [KAP](https://kap.domains/) name vouchers. Twelve projects from the Koinos ecosystem put prizes in. Influencers carried it to a few hundred thousand social followers.

On 20 December the wallet [passed 2,000 active users](https://medium.com/@konio_io/konio-has-more-than-2000-active-users-a6356b90ac22).

I'll be honest about what that number is and isn't. A giveaway measures reach, not retention — a meaningful share of those installs were there for the prize pool and behaved accordingly. What it did do, beyond the wallet, was pull twelve separate projects into a single coordinated push and give a small ecosystem a week of momentum it wouldn't otherwise have had. That part I'd count as the real result.
