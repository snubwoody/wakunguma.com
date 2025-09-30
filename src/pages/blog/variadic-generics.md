---
preview: false
title: "Variadic generics"
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/macros.png
imageSize: 0
published: 2025-12-12
tags: ["GUI"]
---

## What?
Think of variadic generics as variadic functions but at the type system level. It would allow create a rust item that can take any number of generics.

```rust
fn varry_me<..R>(item: R) {
  
}
```

```rust
fn print<M:Display,..T: Display>(message:M,items: T) {
  
}
```

## Why?
Why even bother, rust has been doing just fine without this feature.
There are quite a number of things not possible in current rust or are very un-idiomatic to implement, 
that could be solved by variadics.

Like implementing traits for tuples or tuple-like operations. Currently you would need either a macro
or to implement it manually by hand.

```rust
impl_display! {A,B,C,D,E,F,G,H,I}

// Or

impl<T: Display> Display for (A){ }
impl<T: Display> Display for (A,B){ }
impl<T: Display> Display for (A,B,C){ }
impl<T: Display> Display for (A,B,C,D){ }
```

Either way you are limited by how far you are willing to support. 
My immediate thought was bevy's systems. Right now they're implemented manually up to a limit of 16.

In bevy any function that with parameters that can be turned into system parameters is a system. 
An implementation for that would look something like this:

```rust
trait System<Input> {}

impl<F: FnMut()> System<()> for F {}

impl<F: FnMut(T1), T1: 'static> System<(T1,)> for F {}

impl<F: FnMut(T1, T2), T1: 'static, T2: 'static> System<(T1, T2)> for F {}
```

A potentially more elegant solution to involving variadics could look something like:

```rust
trait System<Input> { }

impl<F:FnMut(T),..T:'static> for F { }
```

It's a similar situation for axum's handlers, basically anything that has to 
deal with dependency injection involving generics. 

There's actually **a lot** of things in rust that use tuple-like syntax (I'm not sure what this is called)
here's a few examples of things that could be extended or made "better" with variadic generics:

- Extend [`std::cmp::min`](https://doc.rust-lang.org/std/cmp/fn.min.html) (or max)

```rust
// Current
fn min<T:Ord>(v1:T,v2:T)

assert_eq!(
    min(
        min(
            min(1,2),
            3
        ),
        4
    ),
    1
);

// New
fn min<..T:Ord>(items:T)

assert_eq!(min(1,2,3,4,5,6),1);
```

- Extend [`std::iter::zip`](https://doc.rust-lang.org/std/iter/fn.zip.html)

```rust
// Original
pub fn zip<A, B>(
    a: A,
    b: B,
) -> Zip<<A as IntoIterator>::IntoIter, <B as IntoIterator>::IntoIter>
where
    A: IntoIterator,
    B: IntoIterator,
    
// With variadics
pub fn zip<..I: IntoIterator>(items: T) -> Zip<I> 
```

- Remove `extern` calls from `Fn` traits

```rust
// Old
pub trait FnOnce<Args: Tuple> {
    type Output;

    extern "rust-call" fn call_once(self, args: Args) -> Self::Output;
}

// New
pub trait FnOnce<..Args> {
    type Output;

    fn call_once(self, args: Args) -> Self::Output;
}
```

### Fn traits
- [Rust call](https://internals.rust-lang.org/t/pre-rfc-re-think-rust-call-and-function-arguments/12911)

## Other languages
Most languages actually don't have variadic generics at all. Many have variadic function, but not generics.

- [Swift](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0393-parameter-packs.md)

