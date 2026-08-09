---
title: "A wallet inside a chat app that holds no keys"
description: "Putting a self-custody wallet in Telegram means putting it somewhere that must never be allowed to sign anything. The way out was to stop treating the bot as a wallet and start treating it as a remote control."
pubDate: 'Jul 22 2025'
tags: ["blockchain", "wallets"]
heroImage: "../../assets/blog/chat-wallet/hero.png"
heroAlt: "The Sovry Telegram bot's chat screen, with the /start command and a menu of Signup, Accounts, Tokens, NFTs, Withdraw and Deposit buttons"
---

The hardest part of a wallet has never been the wallet. It's that using one starts with installing something, and most people won't.

Chat apps are the obvious way out. People are already in them all day, a bot costs nothing to try, and sending money to someone you're in the middle of a conversation with is a natural act rather than an errand to run. So I built a Telegram front end for Sovrano, the smart-account wallet I'm building on [Koinos](https://koinos.io/).

And immediately ran into the thing that makes chat wallets quietly awful.

## A bot is a server

Telegram bots are not code running on your phone. A bot is a process on somebody else's machine, receiving your messages through an API. If that process can sign a transaction then it holds a key — and a service holding your key on your behalf is a custodian, which is precisely the arrangement self-custody exists to avoid.

Most wallets inside chat apps resolve this by being custodial and not dwelling on the point. The money is theirs until you withdraw it. It works, it's convenient, and it's a different product wearing the same word.

I wanted the other thing: the reach of a chat interface, without the bot ever being able to move a coin. Which meant accepting up front that the bot could not be a wallet. It could only be the remote control for one.

## Every signature leaves the chat

So the bot holds nothing. It knows which addresses you're watching, because it has to show you balances, and that's where it ends. Logging in means typing your nickname: it isn't authentication, it's telling the interface what to look at.

Whenever something genuinely needs a signature, the flow goes elsewhere. The bot prepares the operation — recipient, token, amount — and replies with a link. You approve it in the browser, with whichever authentication method you chose for your account: a passkey and your fingerprint, or a login with Google, Facebook, Discord, or Telegram itself. The signed result comes back to the bot, which drops you back into the conversation, and that link burns there: it's good once.

The bot never sees a key, at any point. It sees an intention going out and a signed result coming back.

That the signature has to happen outside the chat isn't an inconvenience to engineer around, incidentally — it's the security property working. Whatever method you pick, the credential isn't in the bot and can't be reached from there: a passkey is bound to the site that created it and needs the operating system's own prompt, a social login forces you through the provider. There is deliberately no way for a bot to trigger either one on your behalf, and that is exactly why a compromised bot can't quietly authorize anything.

There's a case that makes it obvious: you can sign with Telegram itself, with the same identity you're using to talk to the bot. The authorization still leaves the chat, and the bot still stays outside it.

```d2 title="A payment through the bot: the bot prepares the operation and hands back a single-use link, the signature happens on an approval page outside the chat using a passkey or a social login, and only the signed result returns to the bot"
shape: sequence_diagram

user: You
bot: "the bot\n(a remote server)"
approve: "approval page\n(your browser)"

user -> bot: token, nickname, amount
bot -> bot: prepare the operation
bot -> user: "a link, good once"
user -> approve: open it
approve -> approve: passkey or social login
approve -> bot: the signed result
bot -> user: back to the chat
```

*The bot sees an intention going out and a signed result coming back. At no point in the
sequence is there a step where it holds a key.*

<video controls preload="metadata" poster="/videos/blog/wallet-in-a-chat-app-poster.jpg" aria-label="The actual flow in Telegram: /start in the bot, an auth.sovrano.app page opening to register a nickname and a passkey, choosing a sign-in method, and the bot confirming the account was added" style="width:100%;max-width:320px;margin:0 auto;display:block;aspect-ratio:9/20;border:1px solid var(--color-border);border-radius:0.375rem">
	<source src="/videos/blog/wallet-in-a-chat-app.mp4" type="video/mp4" />
</video>

_The same handoff, recorded: `/start`, the bot hands off to `auth.sovrano.app`, a passkey is registered, and the bot confirms the account without ever seeing it._

## Chat turns out to be a good interface

The rest was more fun than I expected. Bots are bad at dashboards and unusually good at asking one question at a time — which happens to be the right shape for sending money.

Which token: here are your balances, as buttons. To whom: type a nickname, and it resolves. How much. Here's the summary, confirm. That's a wizard, and a wizard inside a chat doesn't feel like a form to fill in: it feels like the conversation you were already having. Balances, transaction history, NFTs and deposit addresses are all just messages with buttons underneath.

For now the bot stops at those features. I intend to add more, even if it won't be simple, within the limits of what Telegram's interface allows.

## Where an interface can live

The bot is proof of something more general. Almost everything a wallet interface does — finding the right token, resolving a nickname, formatting an amount, showing you what you're about to confirm — has no need to touch a secret. Only the signature does. And the bot doesn't produce that signature: it delegates it to an external gateway that opens in the browser, the same piece any other application can call to have an operation authorized.

The real point is that not even that gateway holds your keys. Whether the account is controlled by a passkey, by an OAuth2 identity or by the usual twelve words, the credential stays where it is — on your device, with your provider, in your head — and the gateway only asks. Which is why the interface can live anywhere at all: inside a chat, inside a website, inside any place you'd never trust with a key, because there is no key there.
