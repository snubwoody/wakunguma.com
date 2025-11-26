---
preview: false
title: Rust performance
author: Wakunguma Kalimukwa
synopsis: ""
layout: ../../layouts/BlogLayout.astro
image: /internal/thumbnails/variadic-generics.png
imageAsset: ../assets/internal/thumbnails/variadic-generics.png
imageSize: 0
published: 2025-10-06
tags: [Generics]
---

> That being said, compilation time is a multiplier for basically everything. 
> Whether you want to ship more features, to make code faster, to adapt to a 
> change of requirements, or to attract new contributors, build time is a factor in that.

I think a lot of slow compiling rust crates are due to misused or abused features. The worst case for 
me has been the `windows` crate and `bevy`.

What exactly makes rust's compilation slow? Well rust has a very powerful build system, comprising
compile time macros and build scripts. 

A decent chunk of the compile time is spent on [monomorphisation](https://en.wikipedia.org/wiki/Monomorphization),
the rust compiler has to insert 'copies' of code for each generic type used.

```rust

fn size<T>() -> usize {
    size_of::<T>()
}

fn main() {
    let i32_size = size::<i32>();
    let str_size = size::<&str>();
}

// Would be similar to doing something like:

fn size_i32() -> usize {
    size::<i32>()
}

fn size_str() -> usize {
    size::<&str>()
}

fn main() {
    let i32_size = size_i32();
    let str_size = size_str();
}
```

This adds up quite a lot, especially if there are multiple generics, `fn largest<T,S>()`, so a really
common function like `tokio::spawn` that gets used in multiple places will generate an exponential amount
of code.

One issue I don't see brought up is how rust's stronger dependence on libraries means that popular
libraries that are slower to compile will end up *affecting* all the downstream crates. In a lot of 
other languages the standard library has a lot of built-in tooling which means there's generally less
use of libraries. Rust, however, has a more minimal standard library, so it's fairly common to see a crate
with a lot of dependencies. So one 'bad actor' in the chain affects everyone downstream. If one of your
dependencies included the `regex` crate because they needed to filter a single string, your project now
has to pay for that as well.

Bevy...
As we can see `syn` takes up a lot of the time, and you really have no choice.

Macros are the final piece of the puzzle. It's quite easy to make a macro that has horrible compile times.

Well unfortunately for rust the competition is stiff.

> First of al rust heavily uses generics. That means basically most of your dependence 
> tree must compile a new branch for every type you create and use.

> Second is optimizations on memory layout for every type/branch that can also trigger 
> recompilation of large chunks of the dependency tree.

> I just wonder what the route of rust is, outside the open-source scene 
> (when recompilation is not really feasible).


- Generic functions (Monomorphisation)
- https://rustc-dev-guide.rust-lang.org/backend/monomorph.html
- https://matklad.github.io/2021/09/04/fast-rust-builds.html#Keeping-Instantiations-In-Check
- https://nnethercote.github.io/perf-book/compile-times.html
