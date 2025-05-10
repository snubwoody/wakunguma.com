---
title: Rust nightly features you should watch out for
author: Wakunguma Kalimukwa
synopsis: Today we'll go over interesting nightly rust features
layout: ../../layouts/BlogLayout.astro
published: 2nd May, 2025
image: /thumbnails/rust-nightly-features.png
---

We'll go over interesting nightly features and why they haven't been stabilised yet. A long time ago a lot of useful rust features were nightly features but overtime these have been stabilised and the use of nightly had reduced over the years (which is a good thing).

## Gen blocks
Tracking issue: https://github.com/rust-lang/rust/issues/117078

`gen` blocks provide values that can be iterated over using the `yield` keyword. Manually creating iterators  is often painful and confusing and mutable iterators are often [impossible in safe code](https://rust-unofficial.github.io/too-many-lists/second-iter-mut.html). `gen` blocks provide a much simpler way of creating your own iterators.

Consider an iterator that iterates over the Fibonacci sequence:

```rust 
#![feature(gen_blocks)]

fn fibonnaci_iter(count: u32) -> impl IntoIterator<Item = i32>{
	gen move{
		let mut prev = 0;
		let mut next = 1;
		
		yield prev;
		
		for _ in 0..count{
			let curr = prev + next;
			prev = next;
			next = curr;
			yield curr;
		}
	}
}
```

The equivalent iterator implemented manually would look like:

```rust 
struct FibonacciIter{
	prev: i32,
	next: i32,
	count: u32
}

impl FibonnaciIter{
	fn new(count: u32) -> Self{
		Self{
			prev: 0,
			next: 1,
			count
		}
	}
}

impl Iterator for FibonacciIter{
	type Item = i32;
	
	fn next(&mut self) -> Option<Self::Item>{
		if self.count <= 0{
			return None;
		}
		
		let curr = self.next = self.prev;
		self.prev = self.next;
		self.next = curr;
		return Some(curr);
	}
}
```

When using gen blocks, like any other blocks, you would need to use the `move` keyword when to transfer ownership into the block. 

## Default field values

Tracking issue: https://github.com/rust-lang/rust/issues/132162

This feature allows struct definitions to provide default values for individual struct fields. Those fields can then be left out when initializing the struct.

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

It's a fairly simple but convenient feature. Why not just implement `Default`? Sometimes you might have some specific fields that you don't want to have a default on. Say for example 

What happens when you combine default fields with `#[derive(Default)]`? Well your default fields will override the default value for the type. If we derive default on our above struct we can check to see the output.

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

## Never type
Tracking issue: https://github.com/rust-lang/rust/issues/35121

The `!` (never) type represents a value that **never** gets evaluated.

```rust
#![feature(never_type)]
fn close() -> !{
	// exits the program and never returns
	exit(0)
}
```

Why would you want to represent a value that never evaluates? Well sometimes you have an operation that never returns or is never valid. Take this example, from the [RFC](https://rust-lang.github.io/never-type-initiative/RFC.html), of the implementation of `FromStr` for `String`.

```rust
impl FromStr for String{
	type Error = !;
	
	fn from_str(s: &str) -> Result<String,!>{
		Ok(String::from(s))
	}
}
```

This error can simply never happen, which means we can safely unwrap because we are guaranteed by the compiler that the `Result` will always be `Ok`.

```rust
let r: Result<String,!> = FromStr::from();
let s: String = r.unwrap();
```

The current implementation uses the `Infallible` type as the error, however since it's just an enum it doesn't carry the same level of guarantee.
## Try expressions
Try blocks allow you to run an operation inside a block and return a `Result`, since the block returns a result you can propagate any errors inside the block.

```rust
#![feature(try_blocks)]
use std::io::Error;

let result: Result<Vec<u8>,Error> = try{
	fs::read("foo.txt")?
}
```

Just like their function counterparts, the errors in a try block must coerce into the same type when propagating the errors.

Try blocks actually originated with the `?` operator, they were designed to be used together. In the [original rfc](https://github.com/rust-lang/rfcs/blob/master/text/0243-trait-based-exception-handling.md) the intention was for `?` to propagate errors and `try{}` (originally named catch) to handle errors.

>The most important additions are a postfix `?` operator for propagating "exceptions" and a `catch {..}` expression for catching them.

However once propagating errors was implemented, you could simply return a `Result` from the entire function, which lessened the need for `try` blocks. They still would be useful, in cases where you wanted to propagate errors without returning an error from the function, in other words you've handled all propagated errors and the user can safely use the function without worrying about errors.

## Fn traits

Tracking issue: https://github.com/rust-lang/rust/issues/29625
## Unboxed closures

Tracking issue: https://github.com/rust-lang/rust/issues/29625

