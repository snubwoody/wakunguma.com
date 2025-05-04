---
title: Rust nightly features you should watch out for
author: Wakunguma Kalimukwa
synopsis: Today we'll go over interesting nightly rust features
layout: ../../layouts/BlogLayout.astro
published: 2nd May, 2025
image: /thumbnails/rust-nightly-features.png
---

- Generators/Coroutines
- [Deref patterns](https://github.com/rust-lang/rust/issues/87121)
- [Default field values](https://github.com/rust-lang/rust/issues/132162)
- [If let and while chains](https://github.com/rust-lang/rust/issues/53667)
- [Never type](https://github.com/rust-lang/rust/issues/35121)
- [Try blocks](https://github.com/rust-lang/rust/issues/31436)
- [Fn traits](https://github.com/rust-lang/rust/issues/29625)

We'll go over interesting nightly features and why they haven't been stabilised yet. A long time ago a lot of useful rust features were nightly features but overtime these have been stabilised and the use of nightly had reduced over the years (which is a good thing).

## Coroutines & Gen blocks
`gen` blocks are a much simpler way of creating iterators, if you've been using rust for a while you might know that creating custom iterators often comes with a lot of code, and mutable iterators are often [impossible in safe code](https://rust-unofficial.github.io/too-many-lists/second-iter-mut.html).

```rust 
#![feature(gen_blocks)]

fn foo() -> impl Iterator<Item = i32>{
	gen{
		for i in 0..100{
			yield i;
		}
	}
}

for num in foo{
	// Do stuff
}
```

Coroutines (check)

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

(verbatim) Take a look at the `TryFrom` trait. It attempts to convert one value to a target value, while returning an `Err` value if it fails. However, some conversions never fail: if you want to convert an `i32` to a `String`, that will work every time, meaning that the `Err` case is pointless. The `!` (never) type allows you to encode this into a type system: you would have `try_from` return a `Result<i32, !>`, which tells the programmer (and the compiler) that the `Err` case will _never_ occur. In the future, the compiler should allow you to actually ignore the `Err` case when pattern matching or destructuring, but IIRC that hasn't been implemented yet.

## Try expressions
Try blocks allow you to run an operation inside a block and return a result, since the block returns a result you can propagate any errors inside the block.

```rust
#![feature(try_blocks)]
use std::io::Error;

let result: Result<Vec<u8>,Error> = try{
	fs::read("foo.txt")?
}
```

Try blocks are practically identical to their function counter parts, they must all coerce into the same error type.

Try actually predates the `?` and is the reason it became a thing (check). The `?` operator was originally conceived as syntactic sugar for `try` blocks. In the [original rfc](https://github.com/rust-lang/rfcs/blob/master/text/0243-trait-based-exception-handling.md) the intention was for `?` to propagate errors and `try{}` to handle errors, however with enum errors and the `?` operator the need for try catch blocks reduced quite a lot. However it would still be convenient to use the `?` operator without having to return a result. try blocks used to have the syntax `do catch` so you might see that in some of the rfcs. Sometimes you have a function in which you catch all errors and like to use the `?` operator but you don't want to return a result since you already handled all errors.

```rust 
use std::io::Error;

fn fallible() -> Result<(),Error>{
	// Function that might fail
}

fn fallback(){
	// Fallback function
}

fn foo(){
	let result: Result<(),Error>{
		fallible()?
	}
	
}
```

