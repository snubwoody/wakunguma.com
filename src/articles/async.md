---
preview: false
title: Comparing async in different languages
author: Wakunguma Kalimukwa
synopsis: ""
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/variadic-generics.png
imageAsset: ../assets/thumbnails/variadic-generics.png
imageSize: 0
published: 2025-11-20
tags: [Async]
---

Computers are asynchronous by default, operations run and halt giving CPU time to other programs, but the switches
are so fast that it seems like multiple programs are being run at the same time. This is ignoring the other CPU 
cores ofcourse, in which case multiple programs are being executed at the same time.

Most programming languages are synchronous by default and provide some async functionality to the user to run non
blocking events.

- Green threads
- Coroutines
  - Stackfull
  - Stackless
- Context switching

## Threads

A [thread](https://en.wikipedia.org/wiki/Thread_(computing)) is a sequence of instructions managed independently
by scheduler, each thread has it's own stack and program counter. Threads can either be managed by the operating 
system or the user.

Operating system threads are called OS threads. Threads and context switching is expensive.

Threads implemented in user space are called [green threads](https://en.wikipedia.org/wiki/Green_thread), they emulate
multiple threads without requiring native OS theads and using up the systems resources. Since they are implemented by
the library/language implementations vary. However, they are usually cheaper and don't require nearly as many native
threads. For example a library could schedule a group of thousands of threads on only 4 OS threads, or even
a single core, carefully managing them. 

## Coroutines

Most implementations of concurrency are based on coroutines, there's stackless and stackfull coroutines.

A coroutine is an operation whose execution can be suspended and resumed. Coroutines can be scheduled so that
each gets about an even time to execute. Coroutines are used to not block the thread, allowing allow 
coroutines to run while one is waiting on IO or other resources.

There's stackfull coroutines which have their own stack and stackless coroutines which don't have their own
stack.

Coroutines can be run on one thread or multiple threads.


## Rust

The key elements of concurrency in rust are futures; a [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) 
is a value that is not ready now but will be ready sometime later. You can use the `async` keyword 
to mark a function or block as a future.

```rust
async fn request(){

}
```

This is just syntactic sugar and is the same as specifying a return type of `Future`.

```rust
fn request() -> Future<Output=()>{

}
```

Futures need to be polled to completion. You can use the `await` keyword to 
wait for a future be complete.

```rust
async fn send_image(request: Request){
    let bytes = request.bytes().await;
}
```

Rust futures are lazy, which means that just calling the function won't do anything unless the `await` keyword is used.

Unlike most other languages, rust doesn't come with a runtime to run the asyncronous operations. You must bring your own.
The most popular runtime is [tokio](https://github.com/tokio-rs/tokio) and the second most is [smol](https://github.com/smol-rs/smol). The easiest way to use the runtime is to mark you main function
using the `main` attribute.

```rust
#[tokio::main]
async fn main(){

}
```

A `Future` is an object that stores the state of an operation. It has a poll method that performs a bit of 
work each time it's called and returns the state of that computation, either ready or pending.

```rust
pub enum Poll<T> {
    Ready(T),
    Pending,
}
```

Futures can be stored differently per runtime, but let's just say they're stored in a list. Now each future
needs some way to be called that's what an executor is for. An exector stores a bunch of async tasks ready
to run. To run the tasks the executor needs a [`Waker`](https://doc.rust-lang.org/std/task/struct.Waker.html).
A `Waker` executes a task by notifying it's executor that it's ready to run.

Async executors run async tasks to completion without blocking the main thread.

Futures and tasks are semi-synonymous, but a future is specifically the `Future` trait 
returned by async functions. A task is any asynchronous computation, so a task can be a future, stream
or similar.

## Go

Go has a very unique approach compared to other languages, it uses [goroutines](https://go.dev/tour/concurrency/1). A 
goroutine is a lightweight thread managed by the go runtime. You run a function in a goroutine by using the keyword `go`.

```go
using "fmt"

func shout(message string){
    m := fmt.Sprintf("%s!!!",message)
    fmt.Println()
}

func main(){
    go shout("My car")
    shout("Bring it back")
}
```

In go communication is done via [channels](https://gobyexample.com/channels), which are pipes that connect
goroutines. Channels are typed by the values they are meant to transfer.

```go
package main

import "fmt"

func main() {
    bytes := make(chan []uint8)

    go func ()  {
        bytes <- []uint8{100, 101, 97, 100, 32, 112, 111, 101, 116, 115, 32, 104, 111, 110, 111, 117, 114}
    }()

    msg := <- bytes
    fmt.Println(string(msg))
}

```

Although I feel like it's suprisingly easy to accidentally point to the channel instead of its contents.

```go
bytes := make(chan []uint8)

// Wrong, pointing to the channel itself
msg := bytes

// Correct, getting the data inside the channel
msg = <- bytes
```

## Kotlin

Kotlins approach to concurrency is [coroutines](https://kotlinlang.org/docs/coroutines-basics.html). The basic 
building block of coroutines is a suspending function.

```kt
suspend fun request(){

}
```

## Javascript

Javascript was made to be run in the browser, as such it designed to not block the main thread. Javascript
uses promises to achieve this. 

A [`Promise`](https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs#promise-states) is 
an object that represents an eventual completion of an asyncronous operation and its result.

A Promise can be in one of three states:

- Pending: The initial state, where the asynchronous operation is still running.
- Fulfilled: The operation completed successfully, and the Promise is now resolved with a value.
- Rejected: The operation failed, and the Promise is settled with a reason (usually an error).

You can create a promise using the promise constructor (`new Promise()`), but a more ergonomic way is using
the `async` keyword.

```js
async function request(){

}
```

## Shared state

In a lot of applications shared state is inevitable, one of the most common use cases is sharing a database
pool between requests. Since concurrent operations may or may not be run in parallel, there needs to be some
kind of shared state. This is where a [mutex](https://en.wikipedia.org/wiki/Mutual_exclusion)
comes in, mutexes allow shared, thread-safe state, by only allowing one writer at a time.

We have [`sync.Mutex`](https://pkg.go.dev/sync#Mutex) in go.

In javascript everything is run on a single event loop so there's less need for thread safe state, since
it can only be accessed once at a time.

In rust there are also mutexes, however since rust works based on ownership almost every use of a mutex
will be an `Arc`.

## Ergonomics

In rust libraries have to be written against a runtime. This has led to many crates have different 
features to support different runtimes:

- `runtime-tokio`
- `runtime-async-std`

Although tokio is the most popular so it's becoming more of a standard and most libraries are either
written with multiple runtimes in mind or only tokio.

Tasks spawned in runtimes may or may not be compatible with each other.

## Mixing sync and async

One of the most prominent issues with concurrency is mixing sync and async code. In a lot of cases you can 
just make your whole program async, like in a server it wouldn't affect much. However there are cases where
you can not or don't want to make the whole application async. Like a game engine would the whole engine 
now be async?

Go is the best at this since it takes a widely different approach function colouring isn't as prominent.

## Server

## Resources

- https://doc.rust-lang.org/book/ch17-01-futures-and-syntax.html
- https://users.rust-lang.org/t/futures-and-tasks/35961
- https://tokio.rs/tokio/topics/bridging
- https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs#promise-states
- https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop
