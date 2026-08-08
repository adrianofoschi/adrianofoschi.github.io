---
title: "Building software my school needed"
description: "Everyone expected me to choose the liceo. I picked a technical institute for computer science instead — and spent the first two years doing accounting."
pubDate: 'Jul 25 2023'
tags: ["early-projects"]
heroImage: "../../assets/blog/school-software/hero.png"
heroAlt: "Three projects in order: Scrutini in 2006, in Access and Visual Basic, printing every report card; GeCo, generating and checking double-entry bookkeeping exercises; and Ambito5, a portal five municipalities ran their social services on"
---

In 2003, right after middle school, for someone with my grades the path seemed already decided: a liceo. A technical or industrial institute, in the mind of everyone around me, was the choice you made when you couldn't handle something more demanding — not something a good student did.

I had already made up my mind, though. A technical institute meant, sooner or later, computer science — the subject I actually cared about, after years spent tinkering with footballmatch.it. A liceo would have meant years of humanities subjects that, for what I had in mind to do, seemed close to useless. I didn't choose the technical track because it was a good fit for someone "like me": I chose it because it was the only place where I'd actually get to study what interested me.

There was one detail I hadn't accounted for: at that institute, computer science was only taught seriously starting in the third year. The first two years were almost entirely accounting — balance sheets, bookkeeping, the basics of business economics. I'd picked that school specifically to do computer science, and for two years I did something else entirely.

## Scrutini: the software that printed every report card

Everything changed in the third year, in 2006. That's when my school's principal noticed what I could actually build, and decided to find out how far that went.

The first assignment was "Scrutini," handed to me and a close friend of mine — the same one I'd go on to share years of study, work, and life with. Scrutini was software for exactly the grading sessions where teachers finalize marks at the end of a term: teachers enter grades, the system produces the reports and prints the actual pagelle — report cards — that go home to parents. We built it in Microsoft Access. Not a glamorous choice, but the right one: a desktop database tool a small school could actually run and maintain, with forms for data entry and a report engine built in, no separate hosting or infrastructure to worry about. Behind the forms, though, there was real programming: we built the report engine in Visual Basic, which I already knew. What mattered wasn't the technology, though — it was that two sixteen-year-olds had just been handed the software that would produce every student's official grades. Nobody double-checked that decision for us. It just had to work.

## GeCo: double-entry bookkeeping, in Visual Basic

The second project was smaller in scope but had more personality: "GeCo," short for Gestione Contabilità — accounting management — with a gecko as its icon because the name asked for it. And this is where those two years of accounting, which had felt like wasted time back then, suddenly turned useful: the course included business economics, and a good chunk of those hours were spent on partita doppia — double-entry bookkeeping exercises. GeCo was a Visual Basic tool for exactly that: generating and checking double-entry exercises.

There's something I didn't clock at the time: I was building the practice tool for the exact subject I was being taught, in parallel with actually learning it. That loop — learn the domain, then build the tool that teaches it — turned out to be one I'd repeat many times since.

## Ambito5: a portal five municipalities ran on

The bigger jump came with Ambito5: a real institutional project, a web portal supporting a formal social-services collaboration between five municipalities — the kind of inter-comune administrative arrangement Italian public services run on, coordinating things like social assistance across towns too small to each staff their own office. This wasn't a school exercise anymore; it was public infrastructure, and it earned us a scholarship for building it.

It was also our first real requirements-and-architecture job, not just implementation. Five municipalities meant five sets of needs, and someone had to turn that into one coherent system before a single line of code got written. We built it on .NET, with AJAX for the interactive parts — which in those years was still new enough that using it was a deliberate, slightly bleeding-edge choice, not a default.

## What it taught me

By the end of those years the pattern was already set: whenever someone handed me a real problem, I'd go build the actual thing rather than just study it. Software a real institution depends on doesn't come with training wheels — nobody double-checks it for you just because you're young. Trust gets earned by the work holding up, nothing else.

In 2010, a couple of years after graduating, I went back to that same school — this time as a teacher of programming and web design. First a student, then a teacher.
