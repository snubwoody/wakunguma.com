---
title: Why are macros like that?
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: Macros are weird
image: /thumbnails/macros.png
imageSize: 12
published: 2025-08-30
tags:
  - Macros
  - Rust
---


Rust macros are weird.


## Declarative macros scope
By default, declarative macros are only usable in the module in which they are defined (check) and any sub modules, but can be exported using the 
`#[macro_export]` attribute. This exports the macro from the global namespace, there is no `pub`, `pub(crate)` or any kind of visibility.

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
macro_rules! macro_a {
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


Procedural macros, unlike declarative macros, are fully qualified functions that runat compile time, meaning you can do anything a function can, **but at compile time**.
This has led to some cautions regarding what macros should and shouldn't be able to do, and there have been ideas to 
[sand box](https://internals.rust-lang.org/t/pre-rfc-sandboxed-deterministic-reproducible-efficient-wasm-compilation-of-proc-macros/19359) proc macros 
in a wasm environment, where they wouldn't have access to external state. Technically any crate can run any arbitrary code when you have it as a dependency, however you sign that agreement when you actually run the executable. Proc macros, on the other hand, are run by IDEs on startup.

IDE support is prety bad when it comes to proc macros. Procedural macros can take in any valid token tree, so there isn't really any syntax to follow, and as such
there's not much hinting that can be done. It could be anything, a simple string, [html](https://yew.rs/docs/concepts/basic-web-technologies/html) 
or even a [list comprehension](https://crates.io/crates/list_comprehension_macro). The poor little IDE has no idea what to do. This is especially true for
Domain Specific Languages which have their own custom syntax.

## Conclusion
All in all, macros definitely feel like one of the more "iffy" parts of rust. They are incredible useful which makes changing them even harder, it's no wonder that progress is slow, you
would risk breaking a whole ecosystem of crates.

I got a lot of this information from [The little book of rust macros](https://lukaswirth.dev/tlborm/introduction.html).
