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

Procedural macros need to be declared in a special `proc-macro` crate, and this create can **only** export procedural macros. So with many popular crates you will see a
`x-macros` crate somewhere if they wish to create their own proc macros. This makes sense because they need to be compiled before they can be used.

Procedural macros can only be declared in a specific proc-macro crate. This makes sense because we're used to it, but it makes less sense when you think about the fact that
declarative macros can be declared in the same crate and just work.

## Declarative macros scope
Macros must be exported at the crate level, and (after rust 2018) must be exported using a `#[macro_export]` attribute. This hoists the macro to the top of the crate, before
anything else. There is no `pub`, `pub(crate)` or any kind of visibility.

```rust
// Crate A

mod a {
  #[macro_export]
  macros_rules! my_macro { ()  => {} }
}

// Crate B
use crate_a::my_macro;
```

Declarative macros, unlike anything else in the language, can only be used after their definition.

```rust
// a! in undefined
macro_rules a! { () => {} }
// a! is defined
a!{}
```

The exception to this rule, is macros themselves which can be used in any order.

```rust
macro_rules! macro_a{
    () => {
        macro_b!()
    };
}

macro_rules! macro_b {
    () => {
        macro_a!()
    };
}
```

There have been questions of what exactly macros should be able to do, currenly `sqlx` connects to the network...

Macros make rust an interesting place, at first glance you might imagine that they would only be used for things like anotating structs or wrapping functions, but you can create anything 
in your wildest dreams using macros. Many libraries have their own custom DSL, but the thing I don't like about this, is that with enough of it, it starts to feel like you're using a 
different "in between" language. There's no intellisense and not enough documentation on the syntax, the syntax is also free to change, unlike actual programming languages that would require
**major** revisions for that to happen.

Proc macro 2
Macros 2
Declarative macros 2

## Conclusion
All in all, macros definitely feel like one of the more "iffy" parts of rust. They are incredible useful which makes changing them even harder, it's no wonder that progress is slow, you
would risk breaking a whole ecosystem of crates.

I got a lot of this information from [The little book of rust macros](https://lukaswirth.dev/tlborm/introduction.html).
