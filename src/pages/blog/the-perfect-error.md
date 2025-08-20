---
title: The perfect error
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: If debugging is the process of removing software bugs then programming must be the process of putting them in
image: /thumbnails/rust-nightly-features.png
imageSize: 120000
published: 2025-12-12
guid: 
tags:
  - Rust
---
>If debugging is the process of removing software bugs then programming must be the process of putting them in (link...)

- Structs vs Box? 

Should you use a struct or an enum as an error? Well it depends on what exactly you are doing. If you were making a compiler, the parsing error would need to store the file, line number and column number that the error occurred on.

```rust
struct ParseError{
	path: PathBuf,
	line: u32,
	col: u32,
	kind: ErrorKind
} 

enum ErrorKind {
	UnexpectedEof,
	SyntaxError
}
```

This would let you display non-generic, helpful errors to users.

If you were making an API you may want to create custom error codes that end users can read and use, as they would not have access to the rust enums, and http error codes don't exactly convey the most information.

```rust
struct ApiError{
	/// A brief-ish message of what went wrong.
	message: String,
	/// Optional extra info about this error and how
	/// to deal with it.
	details: Option<String>,
	/// The error code which acts as an enum to users
	/// of the API.
	code: ErrorCode
}

enum ErrorCode{
	SubscriptionExpired,
	AccountNotFound
}

impl IntoCode for ErrorCode{
	fn into_code(&self) -> &'static str{
		Self::SubscriptionExpired => "E0993",
		Self::AccountNotFound => "E2442"
	}
}
```

Take the following error for example:

```rust
use std::io;
pub enum Error{
	Io(io::Error)
}
```

It becomes hard to know what exactly will go wrong.
## Nested errors
Sometimes you wrap an error, while an inner error also wraps the same error. So now you have two sources for the same error.

```rust
use std::io;
use thiserror::Error;

enum Error{
	NetworkError(NetworkError),
	IoError(io::Error)	
}

enum NetworkError{
	ConnectionLost,
	IoError(io::Error)
}
```