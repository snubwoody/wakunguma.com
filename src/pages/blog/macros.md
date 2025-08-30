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

Macros make rust an interesting place, at first glance you might imagine that they would only be used for things like anotating structs or wrapping functions, but you can create anything 
in your wildest dreams using macros. Many libraries have their own custom DSL, but the thing I don't like about this, is that with enough of it, it starts to feel like you're using a 
different "in between" language. There's no intellisense and not enough documentation on the syntax, the syntax is also free to change, unlike actual programming languages that would require
**major** revisions for that to happen.

Proc macro 2
Macros 2
Declarative macros 2
