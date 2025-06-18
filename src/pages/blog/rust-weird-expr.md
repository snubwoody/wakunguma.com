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

fn unit_equals_never() {
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
    loop { i += 1; if i == 1 { match (continue) { 1 => { }, _ => panic!("wat") } }
      break; }
}
```