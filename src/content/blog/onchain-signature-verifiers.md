---
title: "No system call for that: getting passkey and JWT signatures verified on chain"
description: "A smart contract that wants to accept a fingerprint or a Google login has to verify signature formats the blockchain knows nothing about. The fix wasn't writing cryptography — it was knowing where to find code that already fits inside a VM."
pubDate: 'Aug 16 2026'
---

Every blockchain hands contracts a short, fixed menu of cryptography. Usually it's exactly one curve: the one the chain's own accounts are built on, wired in as a system call, and nothing else.

That's fine right up until you want an account controlled by something people actually own. A passkey signs with ECDSA over the NIST P-256 curve. An OpenID Connect identity token from Google or Microsoft is signed RS256 — RSA with SHA-256. On [Koinos](https://koinos.io/), in 2024, a contract could verify neither. There was no system call, so there was nothing to call.

If you want smart accounts that a fingerprint or an existing login can control, that gap is the whole problem. This is how I closed it.

## Rule one: don't write the cryptography

The instinct when a primitive is missing is to implement it. For signature verification that instinct is wrong. These algorithms have decades of subtle failure modes, and a bug doesn't produce a crash, it produces a contract that accepts signatures it shouldn't.

So the actual task is a sourcing problem: find implementations that are already reviewed, already used in anger, and — the constraint that narrows it fast — able to run in an environment with no operating system, no allocator to speak of, and a hard ceiling on code size.

That environment description should sound familiar, because it isn't unique to blockchains. It's also a boot ROM.

- For P-256, [BearSSL](https://bearssl.org/)'s ECDSA verifier, taken through [oreparaz/p256](https://github.com/oreparaz/p256), which flattens it into a single generated header. BearSSL was written for embedded targets from the start.
- For RSA, the implementation from **Chrome OS verified boot**. I [forked it](https://github.com/adrianofoschi/rsa-verify) to work through JWT verification before porting it.

The verified-boot code is the better story of the two. A bootloader has exactly the same shape of problem as a chain contract: it only ever *verifies* signatures, never produces them; it runs before there's an OS to help; it can't allocate; and it has to be small. Someone had already solved verification under my constraints, for completely unrelated reasons, a decade earlier.

## Rule two: make it work outside the chain first

Debugging a contract inside a VM is slow and blind. Before any of this went on chain, I got a real Google ID token verifying in plain C on my laptop — because when it fails, you need to know whether the problem is your port or your inputs.

Getting a JWT into a form the verifier accepts is unglamorous and worth showing, because it's where the mistakes actually live:

```
# the signed part is header.payload — the signature is the third segment
tr '_-' '/+' < signature.b64 > sig_std.b64   # base64url is not base64
base64 -d sig_std.b64 > sig.bin
wc -c < sig.bin                              # must be exactly 256
```

Base64url isn't base64, the padding has to be restored by hand before decoding, and a 2048-bit RSA signature is 256 bytes exactly — if it isn't, stop, because everything after that point will fail for the wrong reason. Then `xxd -i` turns the bytes into a C array, a script converts the provider's JWK into a PEM, another converts the PEM into the key struct the verifier wants, `make`, and you get a yes or a no on your own machine in a second.

Only then is it worth compiling anything to WebAssembly.

## The contract is almost nothing

The final piece is the smallest. Each verifier is a C++ contract compiled to WASM, wrapping its vendored header in about a hundred lines. One entry point, three arguments, one boolean out. No storage, no state, no authority — a pure function that happens to live on a blockchain.

The interesting part is the constants at the top, because each one is a decision:

```cpp
constexpr std::size_t public_key_size = 520;   // RSA 2048 in rsa_verify format (rr, n, ...)
constexpr std::size_t signature_size  = 256;   // RSA 2048-bit signature (PKCS1 v1.5)
constexpr std::size_t msg_size        = 32;    // SHA-256
```

That 520-byte "public key" isn't a public key in any format a provider will hand you. It's `size` and `n0inv` — four bytes each — plus the 256-byte modulus and 256 bytes of R², the Montgomery constant. The verified-boot implementation deliberately takes a *pre-processed* key so it never has to compute those on the device, and that decision, made for a bootloader, is even more valuable here: the arithmetic happens once, off chain, and the contract does only the modular exponentiation. Same for the message: the contract takes a 32-byte digest, not the token, because hashing a few hundred bytes is work that doesn't need to happen on chain either.

The RSA verifier still needs SHA-256 internally, though — not to hash the message, but because verifying PKCS#1 v1.5 means recovering the padded block and checking it byte by byte against the DER prefix for SHA-256 before comparing the digest. Reject the padding check and you accept forged signatures.

The P-256 verifier has its own tell:

```cpp
constexpr std::size_t public_key_size = 65;    // uncompressed point
constexpr std::size_t signature_size  = 64;    // r ‖ s
constexpr std::size_t msg_size        = 70;
```

Sixty-five bytes is an uncompressed elliptic curve point, sixty-four is `r` and `s` back to back — and the seventy-byte message is WebAuthn's own construction, the authenticator data concatenated with the hash of the client data. The contract doesn't parse a passkey response; it's handed the exact bytes the browser signed.

![A sequence diagram: the authenticator returns a signature, authenticator data and client data; the smart account authorizes the call and forwards p256_verify with the signature, the public key and a message built from authenticator data plus the hash of the client data; the verifier answers true](../../assets/blog/verifiers/p256-verify-flow.png)
_The verifier's whole job, at the right-hand end of the flow: three arguments in, `true` out._

Around that: fixed-size buffers, a static work buffer of three words per RSA word, and a protobuf interface generated at build time. No dynamic allocation anywhere. Both contracts are the same file with a different verifier inside.

## What it adds up to

Two stateless contracts, each answering one question — signature, public key, message, valid or not — and suddenly any smart account on the chain can be controlled by a passkey, or by a token issued by an identity provider, with the check happening on chain rather than being asserted by a server.

The chain is dormant now, along with everything I built on it. The transferable part isn't the code, it's where I found it. When you need a cryptographic primitive inside a constrained VM, the useful implementations aren't in the server-side libraries everyone reaches for first — they're in boot loaders, embedded TLS stacks, and firmware. Those authors were solving "verify this without an OS, without an allocator, in as few bytes as possible" long before anyone wanted to check a fingerprint on a blockchain.
