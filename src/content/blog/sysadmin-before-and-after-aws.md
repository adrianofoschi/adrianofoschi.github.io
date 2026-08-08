---
title: "Same word, two different jobs: sysadmin before and after AWS"
description: "I was a systems administrator twice, a decade apart — and the second time, on AWS, almost nothing from the first job carried over."
pubDate: 'Jul 14 2026'
tags: ["career"]
heroImage: "../../assets/blog/sysadmin/hero.png"
heroAlt: "The two jobs a decade apart: installing packages and configuring Apache and MySQL on one specific box to keep a machine alive, against declaring an RDS instance, orchestrating containers and designing the VPC to compose managed services that keep themselves alive"
---

During my last years at university, and for a while after graduating, I worked as a systems administrator for a small hosting company, to pay for my studies. The job was simple enough to describe in full: I managed the customer control panel, answered support tickets, and whenever a client needed a new environment I set one up — almost always a LAMP(P) stack, Linux/Apache/MySQL/PHP, sometimes with something on top for managing the database. I configured small Linux boxes, one at a time, following more or less the same pattern every time. None of it was complex. I never really thought of myself as "a systems administrator" for that job — it was closer to running through a checklist than designing anything.

## A completely different job

From 2019, the work changed completely. I started building product — an initiative that began inside the company I worked for and would later spin out as an independent startup in 2023 (4HSE) — and for years that work had nothing to do with servers, tickets, or control panels. It was product development: features, application architecture, the kind of problems you solve in code, not in the machine running it. The systems administrator I'd been to pay for my studies felt like it belonged to a different life.

## The same word, on AWS

Then, after years of purely product-focused work, I found myself doing — in small doses — what I would have called "sysadmin work" a decade earlier. Only this time the terrain was completely different: EC2, ECS, Docker containers, CloudFront, RDS, S3, Lambda, CloudWatch. Same label as the first job — "I handle the infrastructure" — but almost no real overlap with what I used to do at the hosting company.

## Why were these never the same job?

The core of the difference isn't scale, it's the nature of the work itself. At the hosting company, "being a systems administrator" meant keeping a machine alive: installing packages one by one, configuring Apache and MySQL by hand on that specific box, and when something broke, opening a ticket and fixing it right there, on that instance. I didn't declare the database, I installed and maintained it myself. I didn't design the network, I inherited whatever was already there. On AWS, that same kind of responsibility is almost an entirely different exercise: I don't install a database, I declare an RDS instance and let it be managed; the application doesn't run on a machine I maintain package by package, it runs in a Docker container orchestrated by ECS; I don't inherit the network, I design it — VPCs, security groups, who's allowed to talk to whom. The job isn't "keep a machine alive" anymore, it's "compose managed services that keep themselves alive." It's the same word, systems administrator, applied to two jobs that barely touch.

| | At the hosting company | On AWS |
| --- | --- | --- |
| The database | Installed and maintained by hand, on that box | Declared as an RDS instance, and managed |
| Where the application runs | A Linux box kept alive package by package | A container orchestrated by ECS |
| The network | Inherited, whatever was already there | Designed: VPCs, security groups, who may talk to whom |
| The job, in one line | Keep a machine alive | Compose managed services that keep themselves alive |
| The skill | Mechanical | Architectural |

What changed wasn't just my own experience — the job itself changed. Platforms like AWS didn't make the systems administrator's work easier, they made it a different job. In my case, keeping a machine alive by hand and composing managed services that keep themselves alive have almost nothing in common as skills — one is mechanical, the other architectural. That's probably why, the second time I found myself doing it, it didn't feel like going back to the first job — it felt like a new one.
