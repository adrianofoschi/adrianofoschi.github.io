---
title: "What came next: building software my school actually used"
description: "Still a student, still making FIFA patches on the side — but at 16 my school's principal handed me a real assignment: grade management software the whole school would depend on."
pubDate: 'Aug 1 2026'
---

While footballmatch.it was still running, I was also just a student at a technical institute. Nobody there cared about FIFA superpatches. But somewhere along the way, my school's principal noticed what I could actually build, and decided to find out what I could do with it.

## Scrutini

The first assignment was "Scrutini" — Italian for the grading sessions where teachers finalize every student's marks at the end of a term. The school needed software for exactly that: teachers enter grades, the system produces the reports and prints the actual pagelle — report cards — that go home to parents.

I built it in Microsoft Access. That's not a glamorous choice, but it was the right one: a desktop database tool a small institution could actually run and maintain, with forms for data entry and a report engine built in, no separate hosting or infrastructure to worry about. The part that mattered wasn't the technology, though — it was that a 16-year-old had just been handed the software that would produce every student's official grades. Nobody double-checked that decision for me. It just had to work.

## GeCo

The second piece was smaller in scope but had more personality: "GeCo" — short for *Gestione Contabilità*, accounting management, with a gecko as its icon because the name asked for it. My course of study included business economics, and part of that meant endless practice with *partita doppia* — double-entry bookkeeping. GeCo was a Visual Basic tool for exactly that: generating and checking double-entry exercises.

There's something worth noticing here that I didn't clock at the time: I was building the practice tool for the exact subject I was being taught, in parallel with actually learning it. That loop — learn the domain, then build the tool that teaches it — turned out to be one I'd repeat many times since.

## Ambito5

The bigger jump came with Ambito5: a real institutional project, a web portal supporting a formal social-services collaboration between five municipalities — the kind of inter-comune administrative arrangement Italian public services run on, coordinating things like social assistance across towns too small to each staff their own office. This wasn't a school exercise anymore; it was public infrastructure, and it earned me a scholarship for building it.

It was also my first real requirements-and-architecture job, not just implementation. Multiple municipalities meant multiple stakeholders with their own needs, and someone had to turn that into one coherent system before a single line of code got written. I built it on .NET, with AJAX for the interactive parts — which in 2006 was still new enough that using it was a deliberate, slightly bleeding-edge choice, not a default.

## Where this was heading

Two years later I'd start a computer science degree, but by then the pattern was already set: whatever I was interested in, or wherever someone handed me a real problem, I'd go build the actual thing rather than just study it. Modding a video game and writing grade-management software for a real institution look like unrelated worlds. From the inside, they were the same instinct pointed at two different problems.
