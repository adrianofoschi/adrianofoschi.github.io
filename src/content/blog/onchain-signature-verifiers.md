---
title: "No system call for that: getting passkey and JWT signatures verified on chain"
description: "A smart contract that wants to accept a fingerprint or a Google login has to verify signature formats the blockchain knows nothing about. Writing that verification myself cost too much to run, so the answer turned out to be knowing where to look for code that already fits inside a constrained VM."
pubDate: 'Apr 15 2025'
tags: ["blockchain"]
---

Every blockchain hands contracts a short, fixed menu of cryptography. Usually it's exactly one curve: the one the chain's own accounts are built on, wired in as a system call, and nothing else.

That's fine right up until you want an account controlled by something people actually own. A passkey signs with ECDSA over the NIST P-256 curve. An OpenID Connect identity token issued by Google or Microsoft is signed RS256 — RSA with SHA-256. On [Koinos](https://koinos.io/), a contract can verify neither: the system call doesn't exist, so there's nothing to call.

If you want smart accounts controlled by a fingerprint, or by an account someone already has, that gap is the whole problem. This is how I closed it.

## The first attempt: writing it

The first attempt was to write it. Contracts on Koinos are written in AssemblyScript — a subset of TypeScript that compiles to WebAssembly — so the shortest road was to implement the verification there, in the same language as everything else.

It worked, and it wasn't usable. There are no fees on this chain: every transaction consumes mana, a metered budget, and there's a ceiling on how much of it one can burn. Verifying a signature is arithmetic on enormous numbers — modular exponentiations, curve multiplications — and that arithmetic written in AssemblyScript cost too much. A single verification ate an amount of resources that made doing it on every operation impractical. And on every operation is exactly when it's needed.

The problem wasn't correctness, it was cost. Which changes the question: not "how do I write this", but "where do I find an implementation already written to run where resources are scarce".

## Where to find cryptography that fits in a VM

There's a second reason not to write it, independent of cost. These algorithms have decades of subtle ways to go wrong, and a mistake doesn't crash anything: it makes the contract accept a signature it should have rejected. You find out when somebody takes advantage of it.

So I was looking for an implementation already written, already used in production, that could run under a contract's constraints: no operating system, no dynamic memory allocation, and compiled code that has to stay small.

Those are a bootloader's constraints.

For P-256 I took [BearSSL](https://bearssl.org/)'s ECDSA verifier, by way of [`oreparaz/p256`](https://github.com/oreparaz/p256), which reduces it to a single header file; BearSSL is written for embedded systems. For RSA I took the implementation from Chrome OS verified boot — the code that checks the operating system's signature at startup — and [forked it](https://github.com/adrianofoschi/rsa-verify) to verify JWTs before porting it to the chain.

Verified boot is the clearer case of the two. A bootloader verifies signatures and never produces one, runs before an operating system exists, doesn't allocate memory, and has to fit in very little space: the same four things a contract has to do. Someone had already solved the problem under my exact constraints, a decade earlier, for reasons that have nothing to do with any of this.

The work was getting it into the chain: that C inside a C++ contract compiled to WebAssembly with the Koinos toolchain, and small enough to deploy.

## Make it work off the chain first

Debugging a contract inside a VM is slow and blind: you see that the verification answered no, and you don't know why. So before putting anything on chain, I got a real Google token verifying in C, on my laptop.

Mostly it was there to separate two kinds of error. When a verification fails, the problem is either in the port or in the data being handed to it, and the data is the treacherous part. A JWT has to be taken apart into its three pieces, the signature is encoded in a variant of base64 that isn't base64, and it has to be decoded correctly before it's any use. A 2048-bit RSA signature is exactly 256 bytes long: if it isn't after decoding, there's no point going further, because everything after that will fail for the wrong reason.

With the same code running on a laptop, that answer arrives in a second. Only then is it worth compiling anything to WebAssembly.

## The contract is almost nothing

The contract itself is the smallest part. Each of the two wraps its imported header in about a hundred lines: one entry point, three arguments — signature, public key, message — and a yes or a no coming out. No state, no stored data, no authority: a pure function that happens to live on a blockchain.

The interesting part is what goes in and what doesn't, because every choice is the same choice: take work away from the chain.

The public key the RSA contract expects isn't the key the provider hands you. It's a prepared version, holding the modulus plus a constant computed in advance to make the multiplications fast. Verified boot has that computed by whoever prepares the key, rather than by the device doing the verifying — a decision made for bootloaders that is worth even more here. The sum is done once, outside, and what's left for the contract is only the part that can't be avoided. Same logic for the message: the contract receives a 32-byte digest, not the token, because hashing a few hundred bytes has no business happening on chain.

```d2 title="Split of RSA verification work: the public key is prepared and the token hashed off chain, leaving the contract only a modular exponentiation and a byte-by-byte check of the rebuilt padded block"
direction: down

off: Off chain {
  direction: right
  key: Provider's RSA public key
  prepared: "Prepared key:\nmodulus + precomputed constant"
  token: ID token
  digest: 32-byte digest
  sig: Signature

  key -> prepared: "once, when the\nkey is registered"
  token -> digest: every verification
}

chain: On chain — all the contract does {
  direction: right
  exp: Modular exponentiation
  check: "Rebuild the padded block,\ncheck it byte by byte"
  out: true / false

  exp -> check -> out
}

off.prepared -> chain.exp
off.sig -> chain.exp
off.digest -> chain.check
```

_Everything that can be computed in advance is computed off the chain. What is left inside the box is the part that cannot be avoided._

One thing that can't be moved out is the padding check. Verifying an RSA signature doesn't just mean comparing two numbers: the signed block has to be rebuilt and checked byte by byte. That's where forged signatures hide, and skipping the check means accepting them.

The same idea holds on the P-256 side, and it shows in the arguments: the contract doesn't receive the passkey's response and doesn't parse it. It receives exactly the bytes the browser signed, assembled outside.

```d2 title="Sequence diagram of a passkey signature check: the account asks the sign module, which looks up the registered credential and delegates the maths to a P-256 verifier before answering valid"
shape: sequence_diagram

dapp: DApp
account: Account
sign: Sign module
verifier: P-256 verifier

dapp -> account: execute(operation)
account -> sign: is this signature valid?
sign -> sign: look up the registered credential
sign -> verifier: "p256_verify(signature,\npublic key,\nauthenticator_data +\nsha256(client_data))"
verifier -> sign: true
sign -> account: valid
account -> dapp: operation executed
```

_The verifier's whole job, at the right-hand end of the flow: three arguments in, `true` out._

No dynamic allocation anywhere, fixed-size buffers throughout. The two contracts are the same file with a different verifier inside.

Two stateless contracts, each answering a single question, and from there on any smart account on the chain can be controlled by a passkey or by a token issued by an identity provider — with the check happening on the chain, instead of a server saying "trust me, I verified it".

What I take away isn't the code, it's where I found it — and why there. When you need a cryptographic primitive inside a VM with few resources, the useful implementations aren't in the server-side libraries you reach for first: they're in bootloaders, in embedded TLS stacks, in firmware. The people who wrote them were working under the same constraint that had stopped me here — do as little as possible, with as little as possible — and the decisions that fall out of it, like precomputing everything that can be precomputed somewhere else, hold on a blockchain exactly as they held at the start of a computer.
