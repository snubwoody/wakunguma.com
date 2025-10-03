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

> Note that most of the syntax here is hypothetical.

## What?

[Variadic arguments](https://en.wikipedia.org/wiki/Variadic_function), varaags, or variadic functions,
are functions that can take an arbitrary number of arguments. However, all arguments must be of the
same type.

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


[Variadic generics](https://en.wikipedia.org/wiki/Variadic_template) is the same concept but at the type
system level, allowing a rust item to have an arbitrary number of generic types.

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
Why even bother? Rust has been doing just fine without this feature.
There are a few things that are very un-idiomatic to implement, that could be solved by variadics.

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

My immediate thought was bevy's systems. In bevy any function that with parameters that can be 
turned into system parameters is a system. 
An implementation for that would look something like this:

```rust
trait System<T> {}

impl<F: FnMut()> System<()> for F {}

impl<F: FnMut(T1), T1: 'static> System<(T1,)> for F{} 

impl<F: FnMut(T1, T2), T1: 'static, T2: 'static> System<(T1, T2)> for F {}
```

A potentially more elegant solution to involving variadic generics could look something like:

```rust
trait System<T> { }

impl<F:FnMut(T),..T:'static> System<(..T)> for F { }
```

It's a similar situation for axum's handlers, basically anything that has to 
deal with dependency injection involving generics. 

There's actually **a lot** of things in rust that use tuple-like syntax 
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

// With variadics
fn min<..T:Ord>(items:..T)

assert_eq!(min(1,2,3,4,5,6),1);
```

- Extend [`std::iter::zip`](https://doc.rust-lang.org/std/iter/fn.zip.html)

```rust
// Current
pub fn zip<A, B>(
    a: A,
    b: B,
) -> Zip<<A as IntoIterator>::IntoIter, <B as IntoIterator>::IntoIter>
where
    A: IntoIterator,
    B: IntoIterator,
    
// With variadics
pub fn zip<..I: IntoIterator>(items: ..I) -> Zip<I> 
```

- Remove `extern` calls from `Fn` traits

```rust
// Current
pub trait FnOnce<Args: Tuple> {
    type Output;

    extern "rust-call" fn call_once(self, args: Args) -> Self::Output;
}

// New
pub trait FnOnce<..Args> {
    type Output;

    fn call_once(self, args: ..Args) -> Self::Output;
}
```


## Why not?
Why has this been implemented in rust already? Well I'm not sure, but for one there hasn't been a 
consensus on the syntax. 

There's **a lot** of unanswered questions and unsolved debates over
what exact features should be implemented.

> Type System Challenges
> Inference difficulties: How does the compiler infer ..T when it could be any number of types? 
> This could make type inference much more ambiguous
> Trait coherence: How do you prevent overlapping trait implementations? For example:

- Const generics

### Syntax 
There is currently no consensus on the syntax to be used. There will need to be a way to declare the
that a generic parameter is variadic. `..` and `...` are both valid candidates.
`..T` is a potential candidate, `..` is already used for ranges,
it would fit in but that might introduce some compatibility issues, `...T` is another valid
candidate.

### Variadic lifetimes
If multiple types are supported does that mean variadic lifetimes should be supported as well?
In which case each type would have its own lifetime. Take, for example, a function that iterates overs 
references. With only variadic generics each slice would have to have the same lifetime,
which may be limiting in some instances. With variadic lifetimes, each slice could have a difference lifetime.

```rust
// No variadics
pub fn zip_slice<'a,T>(s1: &'a [T], s2: &'a [T],) 
-> impl Iterator<Item=(&'a T, &'a T)>;

// Variadic generics
pub fn zip_slice<'a,..T>(slices: &'a [..T],) 
-> impl Iterator<Item=(&'a ..T)>;

// Variadic generics + variadic lifetimes
pub fn zip_slice<..'a,..T>(slices: &..'a [..T],) 
-> impl Iterator<Item=(&..'a ..T)>;
```


### Implementation overlap
When implementing an item there would be an overlap for any other implementations. Take a simple 
implementation for a struct.

**FIXME**
```rust
use std::fmt::Display;

trait MyTrait {
    fn process(&self);
}

// Implementation for a single type
impl<T: Display> MyTrait for (T,) {
    fn process(&self) {
        println!("Single: {}", self.0);
    }
}

// Implementation for variadic types
impl<..T: Display> MyTrait for (..T,) {
    fn process(&self) {
        // Process all items
    }
}

// Problem: Which implementation applies to (i32,)?
// Both match! The single-type impl AND the variadic impl (with ..T = i32)
```

### Macros
Most, if not all of these, issues can be solved using macros, regardless of how unpleasant to write 
that may be. So the **need** for variadic generics is questioned through that perspective.


### Multiple variadic parameters
Would multiple variadic generics be allowed? The issue is figuring out where one ends and the other
begins. 

```rust
fn join_tuple<..A,..B>(a: (..A),b: (..B)) -> (..A,..B);
```

## Other languages
Many languages have variadic functions, in fact I think more languages have it than don't. 
However, fewer languages have variadic generics, or some equivalent feature. In most of the languages that 
have variadic arguments, the language is either dynamically typed or the varaags must be of the same type.
As far as I'm aware these are the languages that have variadic generics or some roughly equivalent feature:

- [C++ Variadic templates](https://gcc.gnu.org/wiki/variadic-templates)
- [Swift Parameter packs](https://www.swift.org/blog/pack-iteration/)
- [Typescript variadic tuples](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## Resources
- [Sketch](https://hackmd.io/@Jules-Bertholet/HJFy6uzDh)
- [A madman's guide to variadic generics](https://gist.github.com/soqb/9ce3d4502cc16957b80c388c390baafc)

