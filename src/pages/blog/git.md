---
preview: false
title: The perfect git history
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/hosting-rust.png
imageSize: 0
published: 2025-07-10
tags:
  - git
  - github
  - version-control
---
> Git the version manager from hell
> - Linus Torvals

- `git replace`

What does the perfect git history look like? One question that comes up all the time is whether to rebase, squash or merge.
## Merging changes
Say you just got done implementing a change in a feature branch: adding a login form to a website. The commit history looks like this:

```text
Add login form
Redirect to home page on success
Check if user exists
Fix typo in email field
```

What's the ideal way to merge these changes into the main branch.
### Merge
You can simply merge these into main with a commit message.

```bash
git checkout main
git merge login-form -m "Add login form"
```

This works perfectly fine. The issue arises when you actually want to traverse your commit history, maybe in a bisect. The problem is that when you are writing code, you're not always concerned with having the perfect commit message every time, commits can get noisy and you often have to backtrack, fix typos, format code and so on. Seeing commit messages like `Run formatter` everywhere doesn't help. 

Of course merge is not bad at all, it's the default for a reason as it's the safest and preserves the most information, but uncontrolled merging can lead to the tower of doom.
[image]

#### Fast forward
When merging a branch into the original branch, if there are not new commits on the original branch a **fast forward merge** can be performed. No new merge commit is needed to combine the changes, instead the HEAD (along with the index) is pointed to the latest commit. Similar to rebasing, except it doesn't modify any history.

```bash
git checkout main
git merge login-form -ff-only
```

A fast forward merge simply treats the commits as if they were on the main branch the entire time.

#### Squash merge
A squash merges combines all the commits on the current branch into one single commit.

```bash
git checkout main
git merge login-form --squash
git branch -d login-form
```

Squash merging is great when you branch off to implement a single feature, or at least a small number of changes.

[animation]
### Rebasing
[Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) is dangerous because it changes the history, in particular your local history diverges from the upstream history and now you're screwed. 

The typical use case for rebasing is the idea of a linear history, having a linear history makes it much easier to traverse. But one danger regarding rebase: it changes the git history. Locally this isn't bad however if you are rebasing changes upstream then you could mess up your history or other dependants histories.

How dangerous?

>Ahh, but the bliss of rebasing isn’t without its drawbacks, which can be summed up in a single line:
>**Do not rebase commits that exist outside your repository and that people may have based work on.**

- `--onto`

#### Interactive rebase

### Cherry pick
## Soft reset
You can so a soft reset to the commit you branched off of and apply all this changes in a single commit.

There's no perfect git history, overall the most important part is having good commit messages.
## Force pushing
## Pulling upstream changes
Prefer rebase when pulling changes

## Commit messages
Of course all of this is useless if the git repo consists of `WIP` everywhere. A commit message should be a short description of the changes. Message bodies... When in doubt use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). 

## Long-lived branches vs feature branches
Git will most likely be a part of your developer life for a long time, so you might as well get good at git.

The more long lived branches you have the more complex your repo will be. However there are genuine use cases for long lived branches.
- LTS versions
- Release candidates
- Experimental features/rewrites

However these are highly special use cases so in general **prefer feature branches**.

## Merging changes from upstream
You working on a feature but there's been some changes to the main branch, how do you update your feature branch?