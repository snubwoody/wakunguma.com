---
title: Rust's weird expressions
author: Wakunguma Kalimukwa
published: 2025-12-12
layout: ../../layouts/BlogLayout.astro
image: https://cdn.pixabay.com/photo/2020/04/02/22/05/home-office-4996834_1280.jpg
imageSize: 5723169
synopsis: Web assembly has enabled rust to be used on the frontend, and it has come a long way since
preview: false
---

Rust has [weird expressions](https://github.com/rust-lang/rust/blob/master/tests/ui/weird-exprs.rs)
## Strange

```rust
fn strange() -> bool {let _x:bool = return true;}
```

## Funny

```rust
fn funny(){
	fn f(_x: ()){}
	f(return);
}
```

The `f` function takes in a unit type, when we call `f(return)` we're exiting from the `funny` function so nothing ever gets evaluated as the parameter or rather the unit type is the parameter so it's still valid syntax.

## What

```rust
fn what(){
	fn the(x: &Cell<bool>){
		return while !x.get() {x.set(true);};
	}
	let i = &Cell::new(false);
	let dont = {||the(i)};
	dont();
	assert!(i.get());
}
```

## Zombie jesus

```rust
fn zombiejesus() {  
    loop {  
        while (return) {  
            if (return) {  
                match (return) {  
                    1 => {  
                        if (return) {  
                            return  
                        } else {  
                            return  
                        }  
                    }                    
                    _ => { return }  
                };  
            } else if (return) {  
                return;  
            }  
        }        
        if (return) { break; }  
    }
}
```

The `return` keyword is a valid expression in rust, which evaluates to `!`.  This function exits at the first return statement, if you instead panic in the while loop the code will run fine.

```rust
fn zombiejesus() {  
    loop {  
        while (return) {  
            panic!("");  
        }        
        if (return) { break; }  
    }
}
```

All the other statements are just to make sure that the return keyword can be used as it is a valid expression.

## Not sure

```rust
use std::mem::swap;

fn notsure() {
    let mut _x: isize;
    let mut _y = (_x = 0) == (_x = 0);
    let mut _z = (_x = 0) < (_x = 0);
    let _a = (_x += 0) == (_x = 0);
    let _b = swap(&mut _y, &mut _z) == swap(&mut _y, &mut _z);
}
```

First we create a variable `_x` then assign the variable `_y` to the expression `(_x = 0) == (_x = 0)`. This set's `_x` to 0 twice, both expressions evaluate to the unit type, which is equal to itself therefore `_y` is true. Then we have almost the same thing for `_z` but instead we are checking if `() < ()` which is false. Same thing for `_a`. 

## Cant touch this

```rust

fn canttouchthis() -> usize {
    fn p() -> bool { true }
    let _a = (assert!(true) == (assert!(p())));
    let _c = (assert!(p()) == ());
    let _b: bool = (println!("{}", 0) == (return 0));
}
```

This seems like an error, in fact rust analzyer will raise an error in your IDE.

We assign `_b` to the expression `(println!("{}",0) == (return 0))`. Since we return 0 the function is valid. This expression is valid because the never type can coerce into any type, so it just coerces into the unit type and we're just comparing `()` to itself, which is true. This same feature works for other types as well.

```rust
use std::process::exit;

fn never_coerce() {
	let _a = 1.eq(panic(""));
	let _b = true.eq((return));
	let _c = () == exit(0);
}
```

## Angry dome

```rust
fn angrydome() {  
    loop { if break { } }  
    let mut i = 0;  
    loop {   
		i += 1;   
		if i == 1 { 
			match (continue) { 
				1 => { }, 
				_ => panic!("wat") } 
			}  
	        break;   
		}  
}
```

In the first line we immediately exit the loop, because `break` is a valid expression we can use it in an if statement. It makes more sense if we expand it out.

```rust
#![feature(never_type)]

loop{
	let _a: ! = break;
	if _a {
		panic!("");
	}
}
```

In the next part we assign `i` to 0. We increment `i` in the loop, the if statement will run in the first iteration since `i` is now 1. We match `(continue)` which evaluates to `!`, never can coerce into any type making the match statements valid syntax, but because we `continue`d the loop skips to the next iteration, we increment `i` again so it's now `2`. The if statement doesn't run so the loop `break`s and the function returns.

## Union

```rust
fn union() {
    union union<'union> { union: &'union union<'union>, }
}
```

This is just testing that the union keyword can be used in these places.

## Punch card

```rust
fn punch_card() -> impl std::fmt::Debug {
    ..=..=.. ..    .. .. .. ..    .. .. .. ..    .. .. .. ..
    ..=.. ..=..    .. .. .. ..    .. .. .. ..    .. ..=.. ..
    ..=.. ..=..    ..=.. ..=..    .. ..=..=..    ..=..=..=..
    ..=..=.. ..    ..=.. ..=..    ..=.. .. ..    .. ..=.. ..
    ..=.. ..=..    ..=.. ..=..    .. ..=.. ..    .. ..=.. ..
    ..=.. ..=..    ..=.. ..=..    .. .. ..=..    .. ..=.. ..
    ..=.. ..=..    .. ..=..=..    ..=..=.. ..    .. ..=..=..
}
```

In rust `..` is a an unbounded range i.e. [`RangeFull`](https://doc.rust-lang.org/std/ops/struct.RangeFull.html) usually used in slices, `..=` is a range which is bound to the end i.e. [`RangeToInclusive`](https://doc.rust-lang.org/std/ops/struct.RangeToInclusive.html). All the different ranges have types which you can see in the `std::ops` [docs](https://doc.rust-lang.org/std/ops/index.html). 

Ranges can be combined into whatever amalgamation you would like:

```rust
use std::ops::{RangeFull, RangeTo, RangeToInclusive};

let _a: RangeToInclusive<RangeTo<RangeFull>> =  ..=.. .. ;
```

`punch_card` is just a mix of these types, all of which implement `Debug` so the return type is valid.

## Monkey barrel

```rust
fn monkey_barrel() {
    let val: () = ()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=()=();
    assert_eq!(val, ());
}
```

Here we're just assigning `()` to `()` which evaluates to `()` and we can keep chaining this but the final value will always be `()`.

## Semi's

```rust
fn semisemisemisemisemi() {
    ;;;;;;; ;;;;;;; ;;;    ;;; ;;
    ;;      ;;      ;;;;  ;;;; ;;
    ;;;;;;; ;;;;;   ;; ;;;; ;; ;;
         ;; ;;      ;;  ;;  ;; ;;
    ;;;;;;; ;;;;;;; ;;      ;; ;;
}
```

A semi-colon ends an expression, an expression can be empty so you can place semi-colons after one another and it would be valid syntax.

## Useful syntax

```rust
fn useful_syntax() {  
    use {{std::{{collections::{{HashMap}}}}}};  
    use ::{{{{core}, {std}}}};  
    use {{::{{core as core2}}}};  
}
```

Rust allows grouped `use` statements to reduce boilerplate. These braces can come anywhere even at the root of the statement, there's also no limit to the number of braces you can use.

```
use {std::sync::Arc};
use core::{mem::{{transmute}}};
```

## Infinite modules

```rust
fn infcx() {
    pub mod cx {
        pub mod cx {
            pub use super::cx;
            pub struct Cx;
        }
    }
    let _cx: cx::cx::Cx = cx::cx::cx::cx::cx::Cx;
}
```

We declare a module `cx`, then we create another sub-module also named `cx`, we export the parent module from the child module, which means we can recursively call the parent from the child.

## Tug of war

```rust
fn fish_fight() {
    trait Rope {
        fn _____________<U>(_: Self, _: U) where Self: Sized {}
    }

    struct T;

    impl Rope for T {}

    fn tug_o_war(_: impl Fn(T, T)) {}

    tug_o_war(<T>::_____________::<T>);
}
```
## Skipped
...