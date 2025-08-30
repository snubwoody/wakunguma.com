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


## Declarative macros scope
By default declarative macros are only usable in the module in which they are defined (check) and any sub modules. They can be exported using a `#[macro_export]` attribute. 
This hoists the macro to the top of the crate, before anything else. There is no `pub`, `pub(crate)` or any kind of visibility.

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

### Hygiene
Declarative macros are partially hygienic.
Declarative macros have mixed site hygiene, which means that local variables are looked up at the macro definition, while other symbols are looked up at the invocation site. Which means
that the following will fail to compile, even though syntactically it works.

```rust
struct l;

macro_rules! foo {
    () => {
        fn repeat(l: i32) {}
    };
}

foo!{}
```

> Essentially, the macro system prevents macros from interfering with variables declared outside of the macro,
> amongst other useful things. C's macro system is not hygienic. Rust's and Lisp's (or at least Racket's) are hygienic.

### Declarative macros 2.0
All these issues, and more, have led to the idea of a [declarative macros 2](https://github.com/rust-lang/rust/issues/39412) [RFC](https://github.com/rust-lang/rfcs/blob/master/text/1584-macros.md),
which would create a new macro system that more closely aligns with the other items of rust.

```rust
mod a {
    pub macro foo() { ... bar() ... }
    fn bar() {}
}

fn main() {
    a::foo!(); 
}
```

Although it's still very much in progress.

## Procedural macros

[Procedural macros](https://doc.rust-lang.org/nightly/reference/procedural-macros.html) need to be declared in a special `proc-macro` crate, 
and this crate can **only** export procedural macros, and the proc macros can not be used in the same crate they are defined in. 
This makes sense because they need to be compiled before they can be used.

There have been questions of what exactly macros should be able to do, currenly `sqlx` connects to the network...

Declarative macros are merely token tree input and output, you can't really run expressions inside of them. Procedural macros on the other hand are fully qualified functions that run
at compile time, meaning you can do anything a function can, **but at compile time**. For example [`sqlx`](https://github.com/launchbadge/sqlx) has 
[compile time checks](https://github.com/launchbadge/sqlx?tab=readme-ov-file#compile-time-verification) which sends the query do the database at compile time to check for validity.
If it compiles it valid. This has led to some cautions regarding what macros should and shouldn't be able to do, and there have been ideas to 
[sand box](https://internals.rust-lang.org/t/pre-rfc-sandboxed-deterministic-reproducible-efficient-wasm-compilation-of-proc-macros/19359) proc macros to limit the things they can do.
Technically any crate can run any arbitrary code when you have it as a dependency, however you sign that agreement when you actually run the executable, proc macros on the other hand,
run by default.

Derive and attribute macros, are often quite simple, which is why there has been an RFC to make declarative [attribute](https://github.com/rust-lang/rust/issues/143547) 
and [derive](https://github.com/rust-lang/rust/issues/143549) macros.

### DSL
Another issue is Domain Specific Languages which feel like another language on top of rust.

Many libraries have their own custom DSL, but the thing I don't like about this, is that with enough of it, it starts to feel like you're using a 
different "in between" language. There's no intellisense and not enough documentation on the syntax, the syntax is also free to change, unlike actual programming languages that would require
**major** revisions for that to happen.

Eventually they become so complex that it's own mini-language, requiring backwards compatibilty and such.

Proc macros are recompiled every time in iterative builds.
Proc macro 2
Macros 2
Declarative macros 2

## Conclusion
All in all, macros definitely feel like one of the more "iffy" parts of rust. They are incredible useful which makes changing them even harder, it's no wonder that progress is slow, you
would risk breaking a whole ecosystem of crates.

I got a lot of this information from [The little book of rust macros](https://lukaswirth.dev/tlborm/introduction.html).
