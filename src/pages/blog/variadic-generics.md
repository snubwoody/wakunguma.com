---
preview: true
title: "Variadic generics"
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/weird-expr.png
imageSize: 0
published:
---

## Why?

### Things not possible in current rust

>I'd like the standard library to have unlimited trait implementations for tuples, rather than the current macro-duplication up to 12. This is similar to how we had arrays up to 32, now unlimited thanks to const >generics.
>I'd also like a multi-zip iterator, like Zip but for an arbitrary number of input iterators. The itertools crate has this, but again only up to a manual limit. You mention zipping in your analysis, but that seems ?>like a different type-level thing, zipping types from separate variadics.
>The Itertools trait also has a few tuple methods that I'd like to see generalized.

