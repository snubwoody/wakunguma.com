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

What does the perfect git history look like? One question that comes up all the time is whether to rebase, squash or merge.

Git is similar to CSS in the sense that most of it's complexity comes from the fact that people learn 10% of it and use it like that for the rest of their lives.

A squash merge, combines all commits into one. One underrated use case of squashing is fixing mistakes. 

One thing to remember is that when you push changes upstream they are, generally, a part of the git history forever.

On one hand there's an argument that the git history is a history of how your codebase evolved, people don't really skim git everyday so trying to keep as clean as possible might not always be worth the effort.

On the other hand you might want your git history to track points in time. Not everything is worth remembering, having commits like `Run formatter` or `Fix lint warnings` might not be that useful in the long run.

The problem is that you're not always focused on making things pretty when coding, the process is often messy and involves commits that are partial solutions to whatever problem you're trying to solve. You could maybe have a commit history like this:

Now you're ready to commit, these commits aren't bad but you had one goal in mind: to add a button on the home page. In the long run some of these commits aren't all that important. 

## Merge, squash or rebase?
Say you just got done implementing a change in a feature branch: adding a login form to a website. The commit history looks like this:

```text
Add login form
Redirect to home page on success
Check if user exists
Fix typo in email field
```

What's the ideal way to push these changes to master?
### Merge
You can merge these into main with a commit message as an overview.

```bash
git checkout main
git merge login-form -m "Add login form"
```

This works perfectly fine.
The issue arises when you actually want to traverse your commit history, maybe in a bisect. I started questioning my commit practices when I had to use git bisect as a last resort because I could not figure out a bug. There was so much noise everywhere. Even disregarding git bisect you might want to learn how a project evolved, seeing Run formatter everywhere doesn't help.

But even though this is the "truest" form of changes, it can add a lot of unnecessary noise. If you're the only one on the project then you would just have `branch->main` everywhere.

Of course merge is not bad at all, it's the default for a reason as it's the safest and preserves the most information.

Uncontrolled merging can lead to the tower of doom.
[image]

#### Fast forward
When merging a branch into the original branch, if there are not new commits on the original branch, the a fast forward merge can be performed. No new merge commit is needed to combine the changes instead the HEAD (along with the index) is pointed to the latest commit. Similar to rebasing, except it doesn't modify any history.
```bash
git checkout main
git merge login-form -ff-only
```

### Rebasing
Rebasing is dangerous because it changes the history, in particular your local history diverges from the upstream history and now you're screwed. 

The typical use case for rebasing is the idea of a linear history, having a linear history makes it much easier to traverse. But one danger regarding rebase: it changes the git history. Locally this isn't bad however if you are rebasing changes upstream then you could mess up your history or other dependants histories.

How dangerous?

#### Interactive rebase

## Squash merging 

```text
main: A -- B -- C
```

When critiquing squash merging the typical comment is that it loses information which is true, but if combined with small, directed changes the it could be the perfect way to merge changes. It allows you to commit any how on your feature branch but when it comes time to merge have an actual description of the overall change. It is also good for git bisects...
### Soft reset
You can so a soft reset to the commit you branched off of and apply all this changes in a single commit.

There's no perfect git history, overall the most important part is having good commit messages.
### Force pushing
## Pulling upstream changes
Prefer rebase when pulling changes

## Commit messages
## Long-lived branches vs feature branches

Git will most likely be a part of your developer life for a long time, so you might as well get good at git.