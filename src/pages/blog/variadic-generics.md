---
preview: false
title: Variadic generics
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/variadic-generics.png
imageSize: 0
published: 2025-10-06
tags: [Rust]
---

> Note that most of the syntax here is hypothetical.

[Variadic generics](https://en.wikipedia.org/wiki/Variadic_template) are similar to
[variadic functions](https://en.wikipedia.org/wiki/Variadic_function),
but at the type
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

My first thought was [bevy's systems](https://bevy-cheatbook.github.io/programming/systems.html). 
In bevy any function with parameters that can be 
turned into system parameters is a system. To implement that you would need to write it by hand.

```rust
trait System<T> {}

impl<F: FnMut()> System<()> for F {}

impl<F: FnMut(T1), T1: 'static> System<(T1,)> for F{} 

impl<F: FnMut(T1, T2), T1: 'static, T2: 'static> System<(T1, T2)> for F {}
```

Either way you are limited by how far you are willing to support, most of the time it's implemented
until a high enough number like 16 or 25.

But with variadic generics you could support an arbitrary amount of parameters and write much less code.

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
pub fn zip<..I: IntoIterator>(items: ..I) -> Zip<..I> 
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
There's **a lot** of unanswered questions and unsolved debates over what exact features should 
be implemented. For one, there is currently no consensus on the syntax to be used. 
But the common suggestions are 
`..T`, `...T`, `T..`, `T...` and `T @ ..`. 

- Const generics



### Variadic lifetimes
If multiple types are supported does that mean variadic lifetimes should be supported as well?
In which case each type would have its own lifetime. Take, for example, a function that iterates over 
slices. With only variadic generics each slice would have to have the same lifetime,
which may be limiting in some instances. 
With variadic lifetimes, each slice could have a difference lifetime, giving more freedom to callers.

```rust
// No variadics
pub fn zip_slice<'a,'b,A,B>(s1:&'a [A],s2: &'b [B]) 
-> impl Iterator<Item=(&'a A,&'b B)>;

// Variadic generics
pub fn zip_slice<'a,..T>(slices: &'a [..T],) 
-> impl Iterator<Item=(&'a ..T)>;

// Variadic generics + variadic lifetimes
pub fn zip_slice<..'a,..T>(slices: &..'a [..T],) 
-> impl Iterator<Item=(&..'a ..T)>;
```

### Macros
Most, if not all of these, issues can be solved using macros, regardless of how unpleasant to write 
that may be. Or even just writing the code by hand, you could just pick a limit...
So the **need** for variadic generics is questioned through that perspective.

### Tuple trait
Instead of variadic generics, there have been suggestions to extend the tuple type, which
would keep the design and implementation simpler. If there was some kind of `Tuple` trait
([which there is](https://doc.rust-lang.org/std/marker/trait.Tuple.html)) then it could be 
added as a trait bound and that would serve the same purpose.

```rust
fn sum<N: Tuple + Add>(items: N){
    let mut total = 0;
    for i in N {
        total + i;
    }
    total
}
```

This is what `Fn` traits use as their arguments but it's a compiler built-in and cannot be 
implemented whatsoever.

```rust
pub trait Fn<Args: Tuple>: FnMut<Args> {
    extern "rust-call" fn call(&self, args: Args) -> Self::Output;
}
```


## Other languages
Many languages have variadic functions, in fact I think more languages have it than don't. 
However, fewer languages have variadic generics, or some equivalent feature. In most of the languages that 
have variadic arguments, the language is either dynamically typed or the varaags must be of the same type.
These are some of the languages that have variadic generics or some roughly 
equivalent feature:

- [C++ Variadic templates](https://gcc.gnu.org/wiki/variadic-templates)
- [D Variadics](https://dlang.org/articles/variadic-function-templates.html)
- [Swift Parameter packs](https://www.swift.org/blog/pack-iteration/)
- [Typescript variadic tuples](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## Resources
- [Variadic tuples](https://github.com/rust-lang/rfcs/pull/2775)
