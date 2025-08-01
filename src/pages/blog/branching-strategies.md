---
preview: false
title: Branching strategies
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/hosting-rust.png
imageSize: 0
published: 2025-08-07
tags:
  - Git
---
So I was recently looking at the changelog for [Penpot](https://penpot.app/), and I noticed that they had changes that were meant for 2.9 and other for 2.10. I know that this is a thing, but I started wondering how exactly do they do it? Do they have branches for each release? What changes go into main? So I'll be going over different branching strategies.

Branching strategies could also be called release management, or at least that's how I like to think about it. Because it's all about how we manage changes to software. If your branching strategy needs a complex diagram for people to understand it, then it maybe it might be doing too much.

## Trunk based development
Trunk based development is strategy in which all developers work on a single branch, this is usually `main`, `master` or `trunk`. Features/changes are developed on feature branches:

```bash
git checkout -b feature-branch
```

When the feature is done, it is usually squash merged into the main branch as all changes represent a single feature. This is good because you don't have to worry too much about commit hygiene while you are making changes, then when you're done you just squash everything into main with an actually descriptive commit message.

This means the main branch is the single source of truth and you can basically release any time you want. With a good CI workflow then the main branch is always tested and buildable.

## Github flow
[Github flow](https://docs.github.com/en/get-started/using-github/github-flow) can be seen as a form of trunk-based development, as you make changes to the main branch. 

## Git flow
Git flow a branching model that involves the use of feature branches and multiple primary branches. This workflow uses two main branches `main` and `develop`

The "multiple primary branches" part is what makes this so complex to use, it's hard keeping many branches in sync with each other. 

## Environment branching

## Component branching

## Release branching
This isn't necessarily it's own strategy, but it's based on the idea that releases get their own long lived branches.
## Custom workflows
A lot of times teams will use custom strategies, that may borrow concepts from others, to manage their software. For example the rust team uses a custom strategy with three channels: stable, beta and nightly, which use the three branches, `main`, `stable` and `beta`. Changes are made on the `master` branch which get's released every night (nightly), every six weeks a beta release which goes on the `beta` branch, six weeks after that `beta` is merged into `stable` which is what most people use.
## Summary
As we can see the more branches you have, the harder it is to keep them in sync. You can always change your strategy, however long that may take, to fit your software as it grows over time. In practice a lot of teams merge concepts from different strategies, use github flow for main branch and pull request, but also use a `staging` branch from environment branching to preview changes in hard to test environments. 