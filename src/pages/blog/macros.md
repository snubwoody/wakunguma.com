---
title: Why are macros like that?
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: Macros are weird
image: /thumbnails/hosting-rust.png
imageSize: 12
published: 2025-08-30
tags:
  - Macros
  - Rust
---


Rust macros are weird.

Procedural macros can only be declared in a specific proc-macro crate. This makes sense because we're used to it, but it makes less sense when you think about the fact that
declarative macros can be declared in the same crate and just work.

There have been questions of what exactly macros should be able to do, currenly `sqlx` connects to the network...


Proc macro 2
Macros 2
Declarative macros 2
