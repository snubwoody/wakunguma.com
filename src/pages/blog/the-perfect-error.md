---
title: The perfect error
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: If debugging is the process of removing software bugs then programming must be the process of putting them in
image: /thumbnails/rust-nightly-features.png
imageSize: 120000
published: 2025-08-24
guid:
tags:
  - Rust
---
>If debugging is the process of removing software bugs then programming must be the process of putting them in - Edsger W. Dijkstra

- Structs vs Box? 
- Trait errors?
- `Box<dyn Error>`?
- thiserrror backtrace
- Bubbling up errors

You must test, and to test you must have errors.
## Big error enums 
A common convention in the rust ecosystem is to have a large error enum that holds all the possible errors that can occur in your program, sometimes marked as non-exhaustive. With libraries like [`thiserror`](https://docs.rs/thiserror/latest/thiserror/) this becomes fairly trivial. 

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
	match parse_user_config(){
		Ok(_) => ...
		Err(err) => {
			match err {
				...
			}
		}
	}
}
```

Where would you even begin? There's too many error variants that aren't relating to parse a config file at all.

You could simply get the `Display` format of the error, but the `DatabaseError` might reveal information about your database that you want to hide, or the `NetworkError` might reveal sensitive information you put in the url.

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
	#[error(transparent)]
	IoError(#[from] io::Error),
}
```

Now it's much easier to handle the error.

```rust
use parse::{parse_user_config,ParseError};

fn load(){
	if let Err(err) = parse_user_config(){
		match err {
			Error::ConfigNotFound => 
				eprintln!("Config file not found, please make sure it's in the root of the project."),
			Error::SyntaxError{..} | UnexpectedEof => 
				eprintln!("Failed to parse config: {err}"),
			IoError(_) => eprintln!("{err}")
			
		}
	}
}
```

...obviously there's a limit to this, you can't make an error for every function.

The idea is to think about the end goal of your error, if you are making a CLI, then the end user merely needs a descriptive error, which the [anyhow](https://docs.rs/anyhow/latest/anyhow/) crate would be great for.

## Structs as errors
Structs, as the name implies, work best for structured errors, when errors of a specific kind all need to have the same information in them. Like an API, API errors usually have a message, description, response code and optionally specific error codes.

```rust
use std::{error::Error, fmt::Display};
use http::StatusCode;
  
#[derive(Debug,Clone,PartialEq)]
pub struct ResponseError{
    message: String,
    details: String,
    status: StatusCode,
}

impl Error for ResponseError{}

impl Display for ResponseError{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f,"Error: {}",self.message)
    }
}
```
## Unrecoverable errors
But do you want to handle the error?

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

Nested errors also kind of bring their own baggage, for example `io::Error` doesn't implement `PartialEq`, so now your error doesn't implement `PartialEq`.

This is made worse by the fact that these two errors might be coming from different crates using different versions of the same error.

## No errors
The best error is no error, try to design your code in such a way that the error prone things are handled elsewhere and the other stuff has no errors.

Let's say you have a renderer that renders images to the screen. There's nothing that can go wrong in the final rendering step, when you are just drawing images to the screen. It's all the stuff before, such as opening the image, whether the image format is supported and so on, where stuff can go wrong. So the idea is to have "setup" code that has errors that the caller would expect and "execution" code that has no errors because all the setup has been taken care of.

```rust
struct Pixel(u8,u8,u8);

struct Image {
	pixel: Vec<Pixel>
}

pub fn draw_image(image: Image){
	...
}
```
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

Another issue is that rust doesn't really show what kind of errors can occur, since errors are just values like every other return type. It's also not feasible for every function to have docs describing what kind of errors it returns.
