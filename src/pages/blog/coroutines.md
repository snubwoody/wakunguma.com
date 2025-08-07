---
preview: true
title: "Coroutines: How to pause a function"
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/hosting-rust.png
imageSize: 0
published:
---
A [coroutine](https://en.wikipedia.org/wiki/Coroutine) is an operation that can be suspended and resumed. The primary feature of a coroutine is the fact that they can be paused and resumed at a later date, kind of like futures.

Coroutines were actually added to the languages before futures and were intended for async I/O (check). 

>How do futures created with async/await support suspension? Essentially while you're waiting for some sub-future to complete, how does the future created by the async/await syntax return back up the stack and support coming back and continuing to execute?

One of the main concerns was how to have futures pause and continue execution, which is exactly what coroutines are for. But currently futures are implemented in a work stealing function, instead of futures being suspended and resumed, a future basically steals the CPU from another future and it continues like that until everything has been completed (or indefinitely).

The key benefit of coroutines is that they are stackless, i.e there is no unnecessary allocation. As such they can be used for all kinds of language features such as futures and iterators.

###### Resources
- [Unstable book](https://doc.rust-lang.org/beta/unstable-book/language-features/coroutines.html)
- [eRFC](https://github.com/rust-lang/rfcs/pull/2033)
- [Docs](https://doc.rust-lang.org/std/ops/trait.Coroutine.html)
- [Rendered eRFC](https://github.com/rust-lang/rfcs/blob/master/text/2033-experimental-coroutines.md)
- [Tracking issue](https://github.com/rust-lang/rust/issues/43122)
