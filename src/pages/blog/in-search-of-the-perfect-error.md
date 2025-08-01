---
title: In search of the perfect error
preview: true
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: If debugging is the process of removing software bugs then programming must be the process of putting them in
image: /thumbnails/rust-nightly-features.png
imageSize: 12
published: 2025-12-12
guid: 
tags:
  - Rust
---
>If debugging is the process of removing software bugs then programming must be the process of putting them in (link...)

Sometimes you don't event match the error all you need a simple message.

```rust
pub struct Error(String)
```

Well let's say you're writing a parser every error will have a line and a column.

```rust
pub struct ParseError{
	line: u64,
	col: u64,
	kind: ParseErrorKind
}

pub enum ParseErrorKind{

}
```
