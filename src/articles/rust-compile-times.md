---
preview: false
title: Rust compile times
author: Wakunguma Kalimukwa
synopsis: ""
layout: ../../layouts/BlogLayout.astro
image: /internal/thumbnails/variadic-generics.png
imageAsset: ../assets/internal/thumbnails/variadic-generics.png
imageSize: 0
published: 2025-12-03
tags:
  - Rust
---
What exactly makes rust's compilation slow? Well rust has a very powerful build system, comprising
compile time macros and build scripts. When I say compile times I mean clean builds because that's where a lot of the pain is felt. Incremental compile times aren't bad at all. But clean builds come up a lot of the time:

- Docker builds
- CI/CD 
- Releasing crates or apps using rust

Of course when you compare the compile times to other languages like C++ it's fairly
on par. But rust isn't only used at a low level, it's kind of an amalgamation between
low and high level programming and is often used for both. It's not really as easy as saying 'that one thing there' is what's causing issues, it's more of a system of decisions that as a whole lead to this.

## Compile time evaluation
In rust everything happens at compile time: the borrow checker, build scripts, bundling resources, macro expansion and so on. As we move more guarantees to the compilation step, more work is done at compile time and the compile times suffer, code execution is not free.

### Monomorphization
A decent chunk of the compile time is spent on [monomorphization](https://en.wikipedia.org/wiki/Monomorphization), the rust compiler has to insert 'copies' of code for each generic type used. 

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

### Build scripts
Some build scripts bundle entire libraries or resources into the executable, this relies on I/O and is not cheap.

### Macros

Macros are the final piece of the puzzle. It's quite easy to make a macro that has horrible compile 
times. The issue is that macros are expanded during dev time and during compile time. So slow macros also affect your IDE experience.

For example, the `sqlx` crate sanity checks your queries at compile times, it doesn't actually run them but runs checks ensuring that your queries are valid. I can only imagine that this would have a negative impact on compile times.

> Second is optimizations on memory layout for every type/branch that can also trigger 
> recompilation of large chunks of the dependency tree.

> I just wonder what the route of rust is, outside the open-source scene 
> (when recompilation is not really feasible).

> The system linker on many platforms is slow and doesn't have multi-threading. 

## Dependencies
One issue I don't see brought up, is how rust's stronger dependence on libraries means that popular crates that are slower to compile will end up *affecting* all the downstream crates. In a lot of other languages the standard library has more built-in functionality which means there's generally less use of libraries. Even in javascript if you are strict with dependencies you can eliminate most and only depend on a few important ones. 

Rust, however, has a more minimal standard library, so it's fairly common to see a crate with a lot of dependencies. So one 'bad actor' in the chain affects everyone downstream. I think this is where a lot of the complaints come from. If you write a build script that takes 10 minutes, that's on you, and you accept that. On the other hand, if you pull in a dependency that takes 30 minutes to compile, there's definitely some feeling of "I didn't choose this".

## Linking

By default, rust uses the system linker on most platforms. On most platforms the system linker is slow, single threaded and **very** important, so work isn't always done the linker to improve performance. 

`ldd` is now the default linker on Linux...

TODO test crate with msvc vs ldd

## The future
It's not peak at all, however, rust's compile times have gotten a lot better throughout the years
and will probably continue to do so. As it gains more popularity and, inevitably, more complaints
come in, there will be more and more improvements on compile times.

My biggest issue with rust is the compile times... it really has an effect on developer productivity.

## Resources

- Linking
- https://nnethercote.github.io/perf-book/compile-times.html
- https://lld.llvm.org/
- [Swift slow compile times](https://danielchasehooper.com/posts/why-swift-is-slow/)
- [Const expressions](https://doc.rust-lang.org/reference/const_eval.html)
- [LDD Tracking issue](https://github.com/rust-lang/rust/issues/39915)
- [LDD Linux tracking issue](https://github.com/rust-lang/rust/issues/39915)
- [LDD linking reddit post](https://www.reddit.com/r/rust/comments/1n5yty9/faster_linking_times_with_1900_stable_on_linux/)


