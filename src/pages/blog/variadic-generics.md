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

[Variadic arguments](https://en.wikipedia.org/wiki/Variadic_function), varaags, or variadic functions,
are functions that can take an arbitrary number of arguments.

```rust
fn count_args<T>(..args:T) -> usize {
    let mut count = 0;
    for _ in ..args {
        count += 1;
    }
    count
}

assert_eq!(count_args(),0);
assert_eq!(count_args(1),1);
assert_eq!(count_args(1,10,50,100),4);
```

All the arguments must be of the same type.

[Variadic generics](https://en.wikipedia.org/wiki/Variadic_template) is the same concept but at the type
level, allowing a rust item to have an arbitrary amount of type parameters.

```rust
fn default<..T:Default>() -> ..T {
    for T in ..T {
       T::default();
    }
}

assert_eq!(default(),());
assert_eq!(default<usize>(),0);
assert_eq!(default<usize>(),(0));
assert_eq!(default<usize,bool>(),(0,false));
```

## Why?
Why even bother, rust has been doing just fine without this feature.
There are quite a number of things not possible in current rust or are very un-idiomatic to implement, 
that could be solved by variadics.

Like implementing traits for tuples or tuple-like operations. Currently, you would need either a macro
or to implement it manually by hand.

```rust
impl_display! {A,B,C,D,E,F,G,H,I}

// Or

impl<T: Display> Display for (A){ }
impl<T: Display> Display for (A,B){ }
impl<T: Display> Display for (A,B,C){ }
impl<T: Display> Display for (A,B,C,D){ }
```

Either way you are limited by how far you are willing to support, most of the time it's implemented
until a high enough number like 16 or 25.

Someone might open an issue saying have a tuple with 100 items they want to display, and you 
would close that saying that's just not possible in rust, please make it a list.

My immediate thought was bevy's systems. In bevy any function that with parameters that can be 
turned into system parameters is a system. 
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

impl<F:FnMut(T),..T:'static> System<(..T)> for F { }
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


## Why not?
Why has this been implemented in rust already? Well I'm not sure, but for one there hasn't been a 
consensus on the syntax. `..T` is a potential candidate, `..` is already used for ranges, 
it would fit in but that might introduce some compatibility issues, `...T` is another valid 
candidate.

There's **a lot** of unanswered questions and unsolved debates over
what exact features should be implemented.

### Variadic lifetimes
If multiple types are supported does that mean variadic lifetimes should be supported as well?
In which case each type would have its own lifetime, I'm not sure if I see much of a point in this
but a potential use case could be using borrowed items where each item might have a different lifetime.

Take for example, a function that iterates overs references.
```rust
fn zip_slice<..'a,..T>(slices: ..'a..T)
where T:..'a
-> Zip<&['aT]>
```


```rust
fn var_life<..'a,..T:'..a>() {

}
```


## Proposals


## Other languages
Many languages have variadic functions, in fact more languages have it than don't. However, fewer 
languages have variadic generics, or some equivalent feature. In most of the languages that 
have variadic arguments, the language is either dynamically typed or the varaags must be of the same type.
But without going into too much detail these are languages I know of that have it.

- [C++ Variadic templates](https://gcc.gnu.org/wiki/variadic-templates)
- [Swift Parameter packs](https://www.swift.org/blog/pack-iteration/)
- [Typescript variadic tuples](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## Resources
- [Sketch](https://hackmd.io/@Jules-Bertholet/HJFy6uzDh)
- [A madman's guide to variadic generics](https://gist.github.com/soqb/9ce3d4502cc16957b80c388c390baafc)

