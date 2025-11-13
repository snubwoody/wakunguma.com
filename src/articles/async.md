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

Futures need to be polled to completetion. You can use the `await` keyword to 
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

## Resources

- https://doc.rust-lang.org/book/ch17-01-futures-and-syntax.html
- https://users.rust-lang.org/t/futures-and-tasks/35961
