---
preview: false
title: "Variadic generics"
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/weird-expr.png
imageSize: 0
published:
---

## What?
Think of variadic generics as variadic functions but at the type system level. It would allow create a rust item that can take any number of generics.

```rust
fn varry_me<..R>(item: R) {
  
}
```

```rust
fn print<M:Display,..T: Display>(message:M,item: R) {
  
}
```

## Why?

### Things not possible in current rust
My immediate thought was bevy's systems. Right now they're implemented manually up to a limit of 16.

>I'd like the standard library to have unlimited trait implementations for tuples, rather than the current macro-duplication up to 12. This is similar to how we had arrays up to 32, now unlimited thanks to const >generics.
>I'd also like a multi-zip iterator, like Zip but for an arbitrary number of input iterators. The itertools crate has this, but again only up to a manual limit. You mention zipping in your analysis, but that seems ?>like a different type-level thing, zipping types from separate variadics.
>The Itertools trait also has a few tuple methods that I'd like to see generalized.
>

## Other languages

