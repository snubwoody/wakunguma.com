---
title: Rust's weird expressions
author: Wakunguma Kalimukwa
published: 2025-12-12
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/rust-weird-expressions.png
imageSize: 5723169
synopsis: Web assembly has enabled rust to be used on the frontend, and it has come a long way since
preview: false
---

Rust has a very strong type system, but as a result it has some quirks, some would say cursed expressions. There's a [special file]((https://github.com/rust-lang/rust/blob/master/tests/ui/weird-exprs.rs)) in the rust repository that tests for these features and makes sure there consistent between updates. Note that these are not bugs but rather extreme cases of rust features like loops, expressions, coercion and so on.

## Preface
There's some rust features that you might not have known about that appear in multiple places here.

### Match guards
A [*match guard*](https://doc.rust-lang.org/book/ch19-03-pattern-syntax.html#extra-conditionals-with-match-guards) is an additional `if` condition, specified after the pattern in a match arm, that must also match for that arm to be chosen.

### Bitwise operator
In rust `!` is a [bitwise not](https://doc.rust-lang.org/book/appendix-02-operators.html) operator, which flips the all the bits 

### Return evaluation
If a variable is assigned to the `return` keyword then it's type will be `!` because the function will exit and nothing will ever be evaluated, or rather it will never be evaluated.

```rust
#![feature(never_type)]

fn foo(){
	let _bar: ! = return;
}
```

## Strange

```rust
fn strange() -> bool {let _x:bool = return true;}
```
The expression `return true` evaluates to `!`. The never type can coerce into any type so that's why it can be assigned to a boolean. We can actually use any type and it will still be valid.

```rust
fn strange() -> bool {
	let _x: u8 = return true;
}
```
## Funny

```rust
fn funny(){
	fn f(_x: ()){}
	f(return);
}
```

TODO

## What

```rust
use std::cell::Cell;

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

We define an inner function `the`, which takes in a refence to a `Cell<bool>`. Inside the function, we use a while loop: `while !x.get() {x.set(true)}`. This loop runs once if the cell contains false, setting it to `true`. Since the loop expression evaluates to `()` the function also returns `()`.

Next we create a `Cell<bool>` and bind a closure that calls `the(i)`, we call that closure and assert that `i` is true.
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

The expression `(return)` has the type never, since the never type can coerce into any type we can use it in all these places.

In `if` and `while` statements it gets coerced into a boolean, in a `match` statement it gets coerced into anything.

```rust
let screaming = match(return){
	"aahhh" => true,
	_ => false
};
```
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

We have an uninitialised variable `_x`, we assign `_y` to `(_x = 0) == (_x = 0)`. `(_x = 0)` evaluates to the unit type so `_y` is true. Similar thing with `_z` and `_a`, expect `_z` is false since `()` is not less than itself. I'm not really sure the purpose of swapping them at the end.

## Cant touch this

```rust

fn canttouchthis() -> usize {
    fn p() -> bool { true }
    let _a = (assert!(true) == (assert!(p())));
    let _c = (assert!(p()) == ());
    let _b: bool = (println!("{}", 0) == (return 0));
}
```

The function `p()` function returns that a boolean, the `assert!` macro returns `()`, so `_a` and `_c` are both true.

In the final line `_b` is assigned to the expression

```rust
(println!("{}"),0) == (return 0))
```

The `println!` returns macro returns `()`, and `(return 0)` is `!` which gets coerced into `()` so the expression is valid, this line also returns 0 which makes the function signature valid.

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

In the next part we assign `i` to 0. We increment `i` in the loop, the if statement will run in the first iteration since `i` is now 1. We match `(continue)` which is `!`, the loop skips to the next iteration, we increment `i` again so it's now `2`. The `if` statement doesn't run so the loop exits and the function returns.

## Union

```rust
fn union() {
    union union<'union> { union: &'union union<'union>, }
}
```

Even though

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

```rust
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

## Fish fight

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

The `Rope` trait has a provided method which one generic `U`, and it takes in an argument of type `Self` and another of type `U`. We make a struct `T` and implement `Rope` for it. The `tug_of_war` function takes in a closure which takes in two `T`'s.

```rust
<T>::_____________::<T>
```
 
 The first `<T>` is for calling the method it expands to `T::_____________`, the second `<T>` is the generic, and we're passing this function pointer as the closure because they both have the same signature.
## Dots

```rust
fn dots() {
    assert_eq!(String::from(".................................................."),
               format!("{:?}", .. .. .. .. .. .. .. .. .. .. .. .. ..
                               .. .. .. .. .. .. .. .. .. .. .. ..));
}
```

The range syntax implements `Debug` and gets formatted as '..'. So we can chain them to get a string of dots.

## u8

```rust
fn u8(u8: u8) {  
    if u8 != 0u8 {  
        assert_eq!(8u8, {  
            macro_rules! u8 {  
                (u8) => {  
                    mod u8 {  
                        pub fn u8<'u8: 'u8 + 'u8>(u8: &'u8 u8) -> &'u8 u8 {  
                            "u8";  
                            u8  
                        }  
                    }                
                };  
            }
            u8!(u8);  
            let &u8: &u8 = u8::u8(&8u8);  
            crate::u8(0u8);  
            u8  
        });  
    }  
}
```

Let's take this apart, we have a macro `u8!`, which declares a module `u8` which declares a function `u8` which takes a parameter named `u8` of type `u8` and returns a reference to a `u8`.

```rust
macro_rules! u8 {  
    (u8) => {  
        mod u8 {  
            pub fn u8<'u8: 'u8 + 'u8>(u8: &'u8 u8) -> &'u8 u8 {  
                "u8";  
                u8  
	        }  
        }                
    };  
}
```

The macro only has one arm: when a `u8` literal is passed. Now we can call the `u8` function from the module which just takes in a number (an unsigned integer) and returns a reference to it. We then have `crate::u8(0u8)` which calls the function but because we're checking skipping if it's 0 it doesn't call itself recursively.

## Continue

```rust
fn 𝚌𝚘𝚗𝚝𝚒𝚗𝚞𝚎() {  
    type 𝚕𝚘𝚘𝚙 = i32;  
    fn 𝚋𝚛𝚎𝚊𝚔() -> 𝚕𝚘𝚘𝚙 {  
        let 𝚛𝚎𝚝𝚞𝚛𝚗 = 42;  
        return 𝚛𝚎𝚝𝚞𝚛𝚗;  
    }  
    assert_eq!(loop {  
        break 𝚋𝚛𝚎𝚊𝚔 ();  
    }, 42);  
}
```

These use unicode monospace characters which don't break rust's rules of using keywords as identifiers.

## Fishy

```rust
fn fishy() {
    assert_eq!(
	    String::from("><>"),
        String::<>::from::<>("><>").chars::<>().rev::<>().collect::<String>()
    );
}
```

Rust uses the turbo fish syntax when adding generics and lifetimes. We can add generics even when something doesn't have any generics.

```rust
fn fun(){}

let _a = fun::<>();
```

So in the second half of the assert statement we're just adding empty generics after each method.

## Special characters

```rust
fn special_characters() {
    let val = !((|(..):(_,_),(|__@_|__)|__)((&*"\\",'🤔')/**/,{})=={&[..=..][..];})//
    ;
    assert!(!val);
}
```

We start by comparing two expressions `()` and `{}` which evaluates to the unit type.

```rust
let val: bool = (() == {})
```

In the right expression we create a slice which is a range to a full range, then we get that entire slice using `[..]` and a semi-colon to end the expression so that the final value is `()`.

```rust
let val: bool = (() == {&[..=..][..]})
```

## Match

```rust
fn r#match() {  
    let val: () = match match match match match () {  
        () => ()  
    } {        () => ()  
    } {        () => ()  
    } {        () => ()  
    } {        () => ()  
    };  
    assert_eq!(val, ());  
}
```
## Match nested if

```rust
fn match_nested_if() {
    let val = match () {
        () if if if if true {true} else {false} {true} else {false} {true} else {false} => true,
        _ => false,
    };
    assert!(val);
}
```

An `if` statement can come directly after a match arm.

```rust
match () {  
    () if true => {}  
    _ => (),  
}
```

We have a bunch of nested if statements, we can make it simpler by just using two and wrapping the inner statement in parentheses.

```rust
if (if true {true} else {false}) {true;}
```

The inner if statement is returning `true` if `true` other wise we return false, we can now use this expression as the condition in another if statement, and we can keep chaining these.

## Function

```rust

fn function() {
    struct foo;
    impl Deref for foo {
        type Target = fn() -> Self;
        fn deref(&self) -> &Self::Target {
            &((|| foo) as _)
        }
    }
    let foo = foo () ()() ()()() ()()()() ()()()()();
}
```

The `Deref` trait is used when a type can be implicitly coerced into another type, it's usually used by smart pointers so they can be implicitly used at the underlying type.

We implement `Deref` for foo into a function pointer that returns `foo`, which means we can call that foo again recursively.

```
```

## Bathroom stall

```rust
fn bathroom_stall() {
    let mut i = 1;
    matches!(2, _|_|_|_|_|_ if (i+=1) != (i+=1));
    assert_eq!(i, 13);
}

```

In a match arm multiple patterns can be matched in one arm, separated by `|`.

```rust
let foo = 'a';  
match foo {   
	'a'..'c'|'x'..'z' => {}  
    _ => {}  
}
```

The [`matches!`](https://doc.rust-lang.org/nightly/core/macro.matches.html) macro has the same syntax as a match statement so we can also chain multiple patterns, even if those are wildcard patterns.

```rust
matches!((),_|_|_|_|_|_)
```

```rust
matches!(2, _|_|_|_|_|_ if (i+=1) != (i+=1));
```

We have six different patterns here, which all do the same thing: we check if `i +=1 != i += 1`, which increments it twice, so each iteration is incrementing `i` by 2. `6 x 2 = 12` plus 1 (the initial value) and the final value is 13 so the assert `assert_eq!(i,13)` is true. The `match!(2,..)` doesn't panic because it's a wildcard pattern so any value could have been used. The if statement is always going to be false because the right expression will always be one more than the left so it will run until all the patterns have been tried.

## Closure matching

```rust
fn closure_matching() {
    let x = |_| Some(1);
    let (|x| x) = match x(..) {
        |_| Some(2) => |_| Some(3),
        |_| _ => unreachable!(),
    };
    assert!(matches!(x(..), |_| Some(4)));
}
```

`x` is a closure that takes in a parameter with an unspecified type. The type will be inferred through it's usage.

## Return already

```rust
fn return_already() -> impl std::fmt::Debug {
    loop {
        return !!!!!!!
        break !!!!!!1111
    }
}
```

## Fake macros

```rust
fn fake_macros() -> impl std::fmt::Debug {
    loop {
        if! {
            match! (
                break! {
                    return! {
                        1337
                    }
                }
            )

            {}
        }

        {}
    }
}
```

## Skipped
...
