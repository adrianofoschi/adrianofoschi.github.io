---
title: "A wallet inside a chat app that holds no keys"
description: "Putting a self-custody wallet in Telegram means putting it somewhere that must never be allowed to sign anything. The way out was to stop treating the bot as a wallet and start treating it as a remote control."
pubDate: 'Aug 20 2026'
tags: ["blockchain", "wallets"]
---

The hardest part of a wallet has never been the wallet. It's that using one starts with installing something, and most people won't.

Chat apps are the obvious escape from that. People are already in them all day, a bot costs nothing to try, and sending money to someone you're mid-conversation with is a natural act rather than an errand. So in 2025 I built a Telegram front end for Sovrano, a smart-account wallet I was building on [Koinos](https://koinos.io/).

And immediately ran into the thing that makes chat wallets quietly awful.

## A bot is a server

Telegram bots are not code on your phone. A bot is a process running on somebody's machine, receiving your messages over an API. If that process can sign a transaction, it holds a key — and a service holding your key on your behalf is a custodian, which is precisely the arrangement self-custody exists to avoid.

Most wallets inside chat apps resolve this by being custodial and not dwelling on it. The money is theirs until you withdraw. It works, it's convenient, and it's a different product wearing the same word.

I wanted the other thing: the reach of a chat interface without the bot ever being able to move a coin. Which meant accepting, up front, that the bot could not be a wallet. It could only be a remote control for one.

## Every signature leaves the chat

So the bot holds nothing. It knows which addresses you're watching, because it has to render balances, and that's the extent of it. Logging in is typing your nickname, which it resolves to an on-chain address — it isn't authentication, it's telling the interface what to look at. Nothing about that association gives it any power over the account.

Whenever something actually needs a signature, the flow leaves:

1. The bot builds the operation — recipient, token, amount — and generates a random one-time callback identifier, storing it against your chat.
2. It replies with a link to the authorization page, carrying the unsigned transaction.
3. You approve it in a browser, where your passkey lives, with your fingerprint.
4. The browser redirects to the bot's own small HTTP server, which matches the callback identifier back to your chat, processes the signed result, destroys the record so it can't be replayed, and bounces you back into the conversation.

The bot never sees a key at any point. It sees an intention going out and a signed result coming back.

That the signing has to happen in a browser isn't an inconvenience to engineer around, incidentally — it's the security property working. A passkey is bound to an origin and needs the operating system's own prompt. There is deliberately no way for a bot API to reach in and trigger that, which is exactly why a compromised bot can't quietly authorize anything.

## Chat is a good UI for this, actually

The rest was more enjoyable than I expected. Bots are bad at dashboards and unusually good at asking one question at a time, which happens to be the correct shape for sending money.

Choose a token — here are your balances as buttons. Who's it going to — type a nickname, and it resolves. How much. Here's the summary; confirm. That's a wizard, and a wizard in a chat window doesn't feel like a form, it feels like the conversation you were already having. Balances, transaction history, NFTs and deposit addresses are all just messages with buttons under them.

For the parts that don't fit, they don't fit gracefully, and it's better to accept it than force it. There's no chart in a chat window worth having.

## What it costs, honestly

Two things, and neither disappears with better engineering.

Every signature is a context switch. You're in a chat, then you're in a browser, then you're back. The friction a chat wallet promises to remove is not removed — it's relocated to the one moment where the user is doing something irreversible, which is arguably the right place for it, but let's not pretend the experience is seamless.

And the bot's server knows a lot. Not your keys, so it can't spend anything, but it knows which accounts you watch, who you're paying and how much, because it assembles the transactions. It can't rob you. It also isn't private. Those are different properties and it's worth being clear about which one you're getting.

## Where it ended

Dormant, along with the chain it was built on.

The idea I'd carry into anything else is the split. Almost everything a wallet interface does — finding the right token, resolving a name, formatting an amount, showing you what you're about to do — needs no access to a secret whatsoever. Only the final signature does. Once you separate those cleanly, the interface can live anywhere you like, including places you would never trust with a key, because there's nothing there to steal.
