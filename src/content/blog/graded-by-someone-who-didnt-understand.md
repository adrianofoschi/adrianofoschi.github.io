---
title: "Graded by someone who didn't understand what I'd built"
description: "A university exam graded on usability and security, a BlaBlaCar clone built with an early MVVM framework, and the grade that revealed the professor hadn't understood what he was looking at."
pubDate: 'Oct 8 2024'
tags: ["early-projects"]
heroImage: "../../assets/blog/mvvm/hero.png"
heroAlt: "The Knockout.js logo, white on a red-orange sunburst background"
---

I started a Computer Science degree in 2009 with a very weak background in mathematics. It had never been my subject, and the degree's math courses made that clear immediately: I ended up repeating several of them, struggling to keep pace while other students seemed to move through without much effort. For a couple of years I felt like I was always one step behind — not from lack of effort, but because I was missing foundations other people already had.

Not all of the math was an obstacle, though. Discrete mathematics, of all things, was one of the courses that opened my mind the most from a logical standpoint: sets, relations, graphs, propositional logic — a way of thinking that felt closer to how I already reasoned when writing code, and that course was the first to make it explicit. The Programming Languages course was one of the most interesting of the whole degree too, for a different reason: not so much its difficulty, but the pleasure of seeing formalized what I had so far only worked out by intuition.

## The Web Programming exam: usability and security

One exam I was looking forward to more than most, near the end of the degree, was Web Programming. The assignment was simple to state and anything but simple to do well: build a web project — any web application — and document the work. The two requirements that mattered most were usability and security: avoiding, at the most basic level, mistakes like SQL injection. In practice, most of my classmates turned in projects that either didn't work or were riddled with elementary security holes, built on the same PHP-LAMP examples that were being copy-pasted from site to site at the time.

## What I built: an MVVM frontend and a BlaBlaCar clone

I decided to do things differently. On the server side I chose a PHP micro-framework designed specifically to guarantee a high level of security by default, instead of hand-writing queries and routing the way almost everyone else did. On the frontend I used [Knockout.js](https://knockoutjs.com/) — an MVVM (Model-View-ViewModel) framework that predated Angular and React by a few years, one of the first to bring automatic binding between data and interface to the web without updating the DOM by hand, line by line. With those two pieces I built a working clone of BlaBlaCar: ride search, bookings, user management, and a modern, responsive interface — far from a given at the time, when most university projects stopped at a fixed layout designed only for the lab monitor.

## A 20, and a professor who didn't know what MVVM was

The final grade was 20 out of 30. Very low, especially next to what I'd seen other students submit. I went to ask the professor for an explanation, expecting some technical point I'd missed. Instead, from the conversation, I noticed something else: he hadn't actually understood what an MVVM framework was, or what it meant in practice to separate logic from data and view that way. His level of knowledge about what I had built was, simply, lower than mine. It was a hard thing to take in — not so much the grade itself, but discovering that whoever was judging me didn't have the tools to do it. I absorbed it anyway.

## The opposite result, in Physics

The flip side came from another exam around the same period: Physics. It was a subject I had no great hopes for — I felt as distant from it as from pure mathematics, maybe more. I sat the exam without expecting much. The result was 30 out of 30 with honors, the highest grade I could imagine, exactly where I expected the least.

Put side by side, those two grades don't tell a coherent story, and I think that's exactly the point. A 20 on the work I was proudest of, a 30 with honors where I expected nothing: the grade wasn't a reliable measure of either the quality of what I'd done or my actual understanding of the subject. Sometimes the person judging doesn't have the tools to see what's in front of them, and the merit stays invisible. Other times it goes the other way, and you get rewarded beyond any expectation. I learned early not to put too much weight on a single number — and to trust more in what I actually knew I had built.
