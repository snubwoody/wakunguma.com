---
preview: false
title: Comparing async in different languages
author: Wakunguma Kalimukwa
synopsis: ""
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/variadic-generics.png
imageAsset: ../assets/thumbnails/variadic-generics.png
imageSize: 0
published: 2025-10-06
tags: [Async]
---

Computers are asynchronous by default, operations run and halt giving CPU time to other programs, but the switches
are so fast that it seems like multiple programs are being run at the same time. This is ignoring the other CPU 
cores ofcourse, in which case multiple programs are being executed at the same time.

Most programming languages are synchronous by default and provide some async functionality to the user to run non
blocking events.

## Rust


The key elements of concurrency in rust are futures; a [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) 
is a value that is not ready now but will be ready sometime in the future. You can use the `async` keyword 
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

To actually run the async code you must use a runtime. The most popular runtime is [tokio](https://github.com/tokio-rs/tokio)
and the second most is [smol](https://github.com/smol-rs/smol). The easiest way to use the runtime is to mark you main function
using the `main` attribute. As far as I know most other languages bundle a runtime.

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

Most languages have threads, but handling threads can be complex, error prone, and have bad perfomance. So for concurrency
most languages have async tasks.

> Goroutines run in the same address space, so access to shared memory must be synchronized.
> The sync package provides useful primitives, although you won't need them much in Go as there
> are other primitives. (See the next slide.)


> In C# or Python 3, each function is colored as either sync or async.
> You can quite easily call an async function from a sync context, but doing a blocking
> sync call from an async context is forbidden (although possible).
>

[Channels](https://gobyexample.com/channels)

## Kotlin

Kotlins approach to concurrency is [coroutines](https://kotlinlang.org/docs/coroutines-basics.html). The basic 
building block of coroutines is a suspending function.

```kt
suspend fun request(){

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
