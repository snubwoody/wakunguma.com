---
preview: false
title: The perfect commit history
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/hosting-rust.png
imageSize: 0
published: 2025-07-10
---
> Git the version manager from hell
> - Linus Torvals

One question that comes up all the time is whether to rebase, squash or merge.

Git is similar to CSS in the sense that most of it's complexity comes from the fact that people learn 10% of it and use it like that for the rest of their lives.

A squash merge, combines all commits into one. One underrated use case of squashing is fixing mistakes. 

The typical use case for rebasing is the idea of a linear history, having a linear history makes it much easier to traverse. But one danger regarding rebase: it changes the git history. Locally this isn't bad however if you are rebasing changes upstream then you could mess up your history or other dependants histories.

[animation]?

On one hand there's an argument that the git history is a history of how your codebase evolved, people don't really skim git everyday so trying to keep as clean as possible might not always be worth the effort.

On the other hand you might want your git history to be a representation of how your project evolved, having commits like `Run formatter` or `Fix lint warnings` might not be that useful in the long run.

The problem is that you're not always focused on making things pretty when coding, the process is often messy and involves commits that are partial solutions to whatever problem you're trying to solve. You could maybe have a commit history like this:

```
Add button to home page
Hide button on mobile
Run formatter
Fix lint warnings
Fix typo in form
```

Now you're ready to commit, these commits aren't bad but you had one goal in mind: to add a button on the home page. In the long run the fact that you had to format and lint isn't really important, the typo also isn't important.

So there's a few ways you can fix all of this:

### Squash merge

### Interactive rebase

### Soft reset
You can so a soft reset to the commit you branched off of and apply all this changes in a single commit.

There's no perfect git history, overall the most important part is having good commit messages.


