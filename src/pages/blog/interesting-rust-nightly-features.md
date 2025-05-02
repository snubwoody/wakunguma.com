---
title: Rust nightly features you should watch out for
author: Wakunguma Kalimukwa
synopsis: Today we'll go over interesting nightly rust features
layout: ../../layouts/BlogLayout.astro
---

- Generators/Coroutines
- [Deref patterns](https://github.com/rust-lang/rust/issues/87121)
- [Default field values](https://github.com/rust-lang/rust/issues/132162)
- [If let and while chains](https://github.com/rust-lang/rust/issues/53667)
- [Never type](https://github.com/rust-lang/rust/issues/35121)
- [Try blocks](https://github.com/rust-lang/rust/issues/31436)
- [Fn traits](https://github.com/rust-lang/rust/issues/29625)

We'll go over interesting nightly features and why they haven't been stabilised yet. 

## Default field values

Tracking issue: https://github.com/rust-lang/rust/issues/132162

Not yet added to rust analyser.

This allows struct definitions to provide default values for individual struct fields,

```rust
#![feature(default_field_values)]
struct Player{
	name: String,
	health: u8 = 255,
	damage: u32 = 5
}

let player = Player{
	name: String::from("Player 1"),
	..
}
```

What happens when you combine default fields with `#[derive(Default)]`? Well when you derive `Default` the default field values override the default for the type. If we derive default on our above struct we can check to see the output.

```rust
#[derive(Default,Debug)]
struct Player{
	name: String,
	health: u8 = 255,
	damage: u32 = 5,
}

let player = Player::default();

dbg!(player.name); // Output: ""
dbg!(player.damage); // Output: 5
dbg!(player.health); // Output: 255
```

You can't, however, override the default values when manually implementing default.

```rust
struct Player{
	name: String,
	health: u8 = 255,
	damage: u32 = 5,
}

impl Default for Player{
	fn default() -> Self{
		// This code will raise an error since we have conflicting default values
		Self{
			name: String::new(),
			health: 100,
			damage: 100
		}
	}
}
```

The field values are restricted to `const` values since, so all non-const values like complex functions or methods will fail to compile.

```rust
fn expensive_op() -> i32 {
	return 0;
}
struct Data{
	result: i32 = expensive_op() // Error!
}
```

The code above will fail to compile unless we explicitly make `expensive_op` a const function.
### Inner structs
This also allows you to define complex inner types, although it could get daunting really quickly.

```rust
#![feature(default_field_values)]

struct BronzeArmour{
	health: u8
}

struct Player{
	name: String,
	health: u8 = 255,
	damage: u32 = 5
	armour: BronzeArmour = BronzeArmour{
		health: 50
	}
}

let player = Player{
	name: String::from("Player 1"),
	..
}
```

### Tuples?
### Drawbacks
The feature has not yet been added to rust-analyzer which means every time you use the default syntax, `Struct{..}`, you IDE will raise an error even though the code is working. 

## Never type
Tracking issue: https://github.com/rust-lang/rust/issues/35121

The `!` (never) type represents a value that **never** gets evaluated. An example is a function that exits the program and never returns.

```rust
#![feature(never_type)]
fn close() -> !{
	exit(0)
}
```

This is one of the longest standing nightly features, it's used fairly frequents in the standard library.

Why hasn't it been stabilised? Well there ha

## Try expressions
Try actually predates the `?` and is the reason it became a thing (check). The `?` operator was originally conceived as syntactic sugar for `try` blocks. Try blocks allow you to run an operation inside a block and return a result. 

```
#![feature(try_blocks)]

use std::io::Error;

let result: Result<Vec<u8>,Error> = try{
	fs::read("foo.txt")?
}
```

In the [original rfc](https://github.com/rust-lang/rfcs/blob/master/text/0243-trait-based-exception-handling.md) the intention was for `?` to propagate errors and `try{} catch{}` to handle errors, however with enum errors and the `?` operator the need for try catch blocks reduced quite a lot. However it would still be convenient to use the `?` operator without having to return a result. 

