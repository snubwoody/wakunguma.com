---
preview: false
title: Rust compile times
author: Wakunguma Kalimukwa
synopsis: ""
layout: ../../layouts/BlogLayout.astro
image: /internal/thumbnails/variadic-generics.png
imageAsset: ../assets/internal/thumbnails/variadic-generics.png
imageSize: 0
published: 2025-11-30
tags: [Rust]
---

> That being said, compilation time is a multiplier for basically everything. 
> Whether you want to ship more features, to make code faster, to adapt to a 
> change of requirements, or to attract new contributors, build time is a factor in that.

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
common function like that gets used in multiple places will generate a lot of code.

One issue I don't see brought up, is how rust's stronger dependence on libraries means that popular
crates that are slower to compile will end up *affecting* all the downstream crates. In a lot of 
other languages the standard library has more built-in functionality which means there's generally less
use of libraries. Even in javascript if you are strict with dependencies you can eliminate most and only
depend on a few more important ones. Rust, however, has a more minimal standard library, so it's fairly 
common to see a crate with a lot of dependencies. So one 'bad actor' in the chain affects everyone downstream. 

I think this is where a lot of the complaints come from. If you write a build script that takes 10 minutes, 
that's on you, and you accept that. If you pull in a dependency that takes 30 minutes to compile, there's definitely 
some feeling of "I didn't choose this".

Bevy...

As we can see `syn` takes up a lot of the time, and you really have no choice.

Macros are the final piece of the puzzle. It's quite easy to make a macro that has horrible compile 
times. The issue is that macros are expanded during dev time and during compile time. So slow macros
also affect your IDE experience.

For example, the `sqlx` crate sanity checks your queries at compile times, it doesn't actually run them
but runs checks ensuring that your queries are valid. I can only imagine that this would have a negative
impact on compile times.

I think a lot of slow compiling rust crates are due to misused or abused features. The worst case for
me has been the `windows` crate and `bevy`.

Well unfortunately for rust the competition is stiff.

Build scripts...

> First of al rust heavily uses generics. That means basically most of your dependence 
> tree must compile a new branch for every type you create and use.

> Second is optimizations on memory layout for every type/branch that can also trigger 
> recompilation of large chunks of the dependency tree.

> I just wonder what the route of rust is, outside the open-source scene 
> (when recompilation is not really feasible).

> The system linker on many platforms is slow and doesn't have multi-threading. 

Of course when you compare the compile times to other languages like C++ it's fairly
on par. But rust isn't only used at a low level, it's kind of an amalgamation between
low and high level programming and is often used for both.

- Linking
- Generic functions (Monomorphisation)
- https://www.reddit.com/r/rust/comments/1n5yty9/faster_linking_times_with_1900_stable_on_linux/
- https://en.wikipedia.org/wiki/Linker_(computing)
- https://rustc-dev-guide.rust-lang.org/backend/monomorph.html
- https://matklad.github.io/2021/09/04/fast-rust-builds.html#Keeping-Instantiations-In-Check
- https://nnethercote.github.io/perf-book/compile-times.html
- https://users.rust-lang.org/t/linking-taking-an-inordinately-long-time/39253/4
- https://lld.llvm.org/
- [Swift slow compile times](https://danielchasehooper.com/posts/why-swift-is-slow/)
- [Const expressions](https://doc.rust-lang.org/reference/const_eval.html)

## The future
It's not peak at all, however, rust's compile times have gotten a lot better throughout the years 
and will probably continue to do so. As it gains more popularity and, inevitably, more complaints 
come in, there will be more and more improvements on compile times.

Overall I feel like everything that people love about rust, generics, macros, conditional compilation, are
what make rust have slow compile times. By moving more guarantees to the compilation time, we increase
the amount of work done at compile time, thus increasing compile times.
