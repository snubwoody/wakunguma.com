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