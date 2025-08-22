---
title: The perfect error
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: If debugging is the process of removing software bugs then programming must be the process of putting them in
image: /thumbnails/rust-nightly-features.png
imageSize: 120000
published: 2025-08-22
guid:
tags:
  - Rust
---
>If debugging is the process of removing software bugs then programming must be the process of putting them in (link...)

- Structs vs Box? 
- Trait errors?
- `Box<dyn Error>`?
- thiserrror backtrace

You must test, and to test you must have errors.
## Big error enums 
A common convention in the rust ecosystem is to have a large error enum that holds all the possible errors that can occur in your program, sometimes marked as non-exhaustive. With libraries like [`thiserror`](https://docs.rs/thiserror/latest/thiserror/) this becomes extremely simple and trivial. 

```rust
use thiserror::Error;
use uuid::Uuid;
use std::io;

#[derive(Error,Debug)]
pub enum Error{
	#[error("Network error occured: {0}")]
	NetworkError(#[from] reqwest::Error),
	#[error(transparent)]
	DatabaseError(#[from] sqlx::Error)
	#[error("Session {0} not found")]
	SessionNotFound(String),
	#[error("Network timeout after {0}ms")]
	NetworkTimeout(u64),
	#[error("No user with the id: {user_id} was found")]
	UserNotFound{ user_id: Uuid },
	#[error("Io error: {0}")]
	IoError(#[from] io::Error),
	#[error("Configuration file not found")]
	ConfigNotFound,
	#[error("Invalid config format")]
	InvalidConfigFormat,
	#[error("User JWT expired")]
	JwtExpired
}
```

Let's say we had a function that parsers a user config and returns a `Result<UserConfig,Error>` and we wanted to handle the errors at start up to display a message to a user.

```rust
use parse::parse_user_config;

fn load(){
	let result = parse_user_config();
}
```

Where would you even begin?

You could simply get the `Display` format of the error, but the database error might reveal information about your database that you want to hide, or the network error might reveal sensitive information you put in the url.

## Context specific errors
We could make this better by making a smaller, more focused error that only involved errors related to parsing the config. We'll get rid of the database errors, that's not going to happen. As well as all the errors related to networking.

```rust
use thiserror::Error;
use uuid::Uuid;
use std::io;

#[derive(Error,Debug)]
pub enum ParseConfigError{
	#[error("Configuration file not found")]
	ConfigNotFound,
	#[error("Syntax error on line {line} col {col}: {message}")]
	SyntaxError{
		line: u64
		col: u64,
		message: String,
	},
	#[error("Unexpected EOF")]
	UnexpectedEof,
	#[error("Io error: {0}")]
	IoError(#[from] io::Error),
}
```

...obviously there's a limit to this, you can't make an error for every function.

The idea is to think about the end goal of your error, if you are making a CLI, then the end user merely needs a descriptive error, which the [anyhow](https://docs.rs/anyhow/latest/anyhow/) crate would be great for.

On the contrary, if you were making an API you may want to create custom error codes that end users can read and use, as they would not have access to the rust enums, and http error codes don't exactly convey the most information.

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
## Nested errors
This problem is made even worse due to the fact that we might wrap an `io::Error` for example and also wrap another error that wraps the same `io::Error` so now we have two sources of the same error. So if we wanted to handle all io errors we would need to match twice or somehow combine both. The underlying error might be from two different versions of the same crate.


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

This is made worse by the fact that these two errors might be coming from different crates using different versions of the same error.

## Custom...

```rust
#[derive(Error, Debug)]
#[error("{kind}")]
struct MyError {
    kind: ErrorKind,
    #[source]
    source: Option<Box<dyn std::error::Error + Send + Sync>>,
}
```