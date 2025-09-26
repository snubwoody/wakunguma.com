---
title: Why GUI is so hard in rust
author: Wakunguma Kalimukwa
published: 2025-09-30
layout: ../../layouts/BlogLayout.astro
image: https://cdn.pixabay.com/photo/2020/04/02/22/05/home-office-4996834_1280.jpg
imageSize: 5723169
synopsis: GUI is hard in rust
preview: false
tags:
  - GUI 
---

Animations?

Rust is an amazing candidate for graphical applications, it would be type safe, minimal and 
have good performance. But after years of libraries in other sectors, GUI still feels quite lacking.
There are good crates for sure, dioxus, tauri, iced, but as [areweguiyet](https://areweguiyet.com/)
puts it:

> The roots aren't deep, but the seeds are planted.


A really good GUI crate:

- Needs good documentation
- Easy to use
- State management

## Trees
GUIs are made of trees, which have nodes, which have children. Each of these nodes have 
state which will need to represented somehow.

```
       Root widget
           |
    +------+------+
    |      |      |
  Button  Text   Text
    |
 +--+--+  
 |     |
Icon  Text
    
```

The general flow is:

- View
- Update
- State

Each of these nodes will need to keep some kind of internal state

Rust doesn't do well with trees, a naive approach would probably be composed of `Rc<RefCell<Node>>`.

```rust
use std::sync::RefCell;

pub struct Tree{
    nodes: Vec<Node>
}

pub struct Node{
    parent: Rc<RefCell<Node>>,
    children: Vec<Rc<RefCell<Node>>>
}
```

## Rendering

First things first we need a renderer, which shall we pick? This is going to shape a lot of the future
decisions of the library. There's three general options:

- System libraries
- Web technologies
- Extend an existing crate
- Build a custom renderer

A lot of the most popular are using some sort of browser engine, either porting chromium or using the
system webview. This is good, all the work is done for you, and you can rely on decades worth of experience. 
Although many people have 
a very negative idea 
of using web tech in GUI

Native APIs are a no no. Most platforms don't expose rust bindings to the underlying system
gui renderers, plus this would introduce platform specific quirks.

## State management

A GUI app is basically a heap of state that is represented onto the screen, state that needs to be
accessed in multiple places at the same time, or very shortly after each other. These directly opposes
rust's views of single ownership. State management is complex, thousands of libraries have been created.

## To DSL or not to DSL

It's hard to represent both the functionality and the UI in the same place. Web tech solves this by splitting
into HTML, CSS and JS. Slint does the same. It is at this point where whether to use a DSL
or not comes up. This would basically eliminate a lot of the pain points of rust's ownership allowing you
to make your own mini language.

```rust
use gui::dsl;

dsl!{
    Button{
        on:click=sign_up()
        "Sign up"
    }
}
```

Macros in general have pretty bad IDE support and end up being their own little 
language.
