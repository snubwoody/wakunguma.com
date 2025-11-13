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


The key elements of rust async are futures; a [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) 
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

Async functions without the `await` keyword won't be run. You can use the `await` keyword to 
wait for a future to become request.

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


## Resources

- https://doc.rust-lang.org/book/ch17-01-futures-and-syntax.html
