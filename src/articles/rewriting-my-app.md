---
preview: false
title: Rewriting my app from Tauri to Slint
author: Wakunguma Kalimukwa
synopsis: ""
image: /internal/thumbnails/desktop-apps.png
imageAsset: ../assets/internal/thumbnails/desktop-apps.png
published: 2026-09-12
tags:
  - App Development
---

A while ago, I decided to make a budgeting app in Tauri, [Folio](https://github.com/snubwoody/folio). However, after a few months of working on it, there were just too many issues I faced with Tauri that led me to stop. But I actually used Folio personally so I wanted to still be developing that kind of app for myself. I started experimenting with different GUI frameworks. Firstly I did not like the browserfication of desktop apps, especially because Windows already uses a lot of RAM by itself. So moving off browser technology was the highest priority. 

I decided to rewrite it firstly because I don't like the browserfication of desktop apps, the fact that simple apps are using so much RAM and storage space is a shame. AI is making RAM and storage expensive, so maybe a recession will make optimisation popular again. The new app is [Mukwa](https://github.com/snubwoody/mukwa).

I went to try Flutter, which is now managed Canonical on desktop and is their main framework for Ubuntu apps, so at least you know it's well supported. Flutter is a good framework, but Dart isn't a very good language. It's kind of like slightly worse that other languages in every area. One weird dart choice is that the indent size for `dart fmt` cannot be changed[^2][^3], which seems like a weird hill to die on. But the main issue with Flutter is verbosity, creating custom widgets would take hundreds of lines of code and need me to learn about the intricacies of how the Flutter engine worked.

Then I went on to try Qt, and I don't think you can go wrong with Qt. It's a very mature framework. Some of my favourite apps use Qt, Davinci Resolve, PureRef, PrismLauncher, and they all have a good user experience. It's one of the two main frameworks on Linux. In fact I was going to use Qt for Mukwa and the very first commits were using Qt. But C++ the language ultimately made me not choose Qt. I keep on hearing of all the issues C++ has, copy semantics, `std::vector<bool>` being bitpacked, enums, having to edit both header and source file when changing code. Everytime I would write code I would search "Is xxx safe to do C++", it just has so many footguns that's the only thing I could think about when writing code. I tried Qt with Rust but I ran into problems with this.

Then I finally decided to try Slint, which is made by ex-Qt devs. And that's what I ultimately chose to stick with.

There were other frameworks like Iced but I don't like writing the actual UI code in Rust. Avalonia, as well, seems like a good framework, I just didn't really have time to try it.

## Things I liked about Tauri

Firstly I want to describe my experience with Tauri, things I liked about it and things I did not. The good thing about Tauri was that I had the whole web ecosystem to choose from. If I could not find a certain library in Rust, I was certain would be something on NPM. Similarly, the popularity of the web ecosystem meant that when I got stuck on a problem I could probably search it up and find a question on Stack Overflow, Reddit or Github. 

## Things I didn't like about Tauri

JavaScript is a bad language, TypeScript makes it much better to deal with, but the type system is more of a suggestion than an actual hard rule. At runtime there are not types so weird errors can happen. People say that TypeScript/JavaScript is easier than Rust, and that may be true, but it's so much harder to write code that works in TS. Things used to break all the time. It was hard to test the frontend code.

Tauri seperates frontend and backend code and communication between the frontend and backend is done via IPC. But this separation caused more trouble than it was worth. For one all types passed via IPC must be JSON serialisable. There is no automatic type generation so the backend and frontend would fall out of sync regularly. This seperation also made testing the frontend harder because code that relied on backend code had to use mocks in tests. Managing the mocks was hard and they used to break very often.

IPC made structuring things hard. Should something be implemented in Rust for better guarantees at the risk of making it harder to test from the frontend, or should something be implemented in TypeScript making it easier to call but less guarantees.

Tauri's compile times are bad. Even though Tauri and Slint are both Rust, my Slint app compiles faster than my Tauri app. And in Mukwa I've taken care to avoid pulling dependencies that have bad compile times. 

The NPM ecosystem moves fast and breaks things all the time. There is no official linter, no official formatter. People keep reimplementing things. There's dozens of test libraries, formatters, linters. People even write different JavaScript runtimes. Overall it's not a stable base for an application.

HTML was not designed to model applications, and you can definitely feel it.

Tauri's compile times are bad. Even though Tauri and Slint are both Rust, my Slint app compiles faster than my Tauri app. And in Mukwa I've taken care to avoid pulling dependencies that have bad compile times.

## Things I like about Slint

I really like the Slint language, it is very well thought out. Ever since trying, and failing, to make my own [GUI framework](https://github.com/snubwoody/agape-rs), realise than maybe Rust isn't the best language for describing user interfaces. For one there's so much shared state in an app which doesn't map well to Rust's single ownership principle. There's also default values, mutability, global variables, strictness and so on. I believe these are these are the same reasons game dev in Rust isn't doing as well so far[^1].

In contrast, the Slint language makes writing and composing user interfaces very easy and intuitive. It has default field values, primitives for colours and length, built in translation and accessibility. It has two way property bindings, callbacks and so on.

I also like that Slint is more of a basic framework instead of a batteries included one. It does not concern itself with logging, networking, packaging or any such things. It cares about the user interface and nothing else. Neither approach is inherently bad, but I prefer Slint's approach. I also like that my app is distributable as a single small executable. The final binary is fast and small and on my machine it uses < 50MB of RAM.

## Things I don't like about Slint

Slint is a programming language but the Slint developers want to encourage people to write most of the logic in Rust and so it is not turing complete (?), so there are some operations that cannot be done in the Slint language that lead to more boilerplate and worse ergonomics. For example, Slint arrays can't be mapped (or filtered or any other operations) so something like the following can't be implemented:

```slint
struct File {
    name: string,
    path: string
}

export global State {
    in-out property<[File]> files;
}

ComboBox {
    options: files.map(file => { text: file.name, value: file.path });
}
```

Slint types cannot be exported to Rust if they do not inherit the Window component, so if you have a component and want to have a callback on that component only, it must be implemented as a global callback.

Slint does not have a test suite for testing the GUI code like [Qt Test](https://doc.qt.io/qt-6/qtest-overview.html) or [Flutter's test suite](https://docs.flutter.dev/cookbook/testing/widget/introduction). There is a [testing crate](https://crates.io/crates/i-slint-backend-testing), but it is unstable and marked as an internal crate. However, since the Slint code compiles down to Rust and because Slint heavily encourages you to implement functionality in the backend, this isn't as bad as it would be in other GUI frameworks. But still testing the frontend code is still extremely important and I'm suprised that it wasn't done by 1.0.

Also one potential drawback is that Slint is licensed under the GPL V3 or a royalty free license. This isn't an issue for me because my app uses GPL V3 but it does limit your options, and not everyone would like these licenses. The Rust ecosystem does not use dynamic linking much so an LGPL V3 license is probably not going to happen anytime soon.

There's a bunch of other small annoyances that I have with Slint:

- There is no Linter for the Slint language
- The formatter does not indent code under comments 

Overall I think Slint is one of the most promising GUI frameworks in Rust. Most of the issues I have are issues of a new/young framework, so to a certain degreee it is to be expected.

[^1]: [Leaving Rust gamedev after 3 years](https://loglog.games/blog/leaving-rust-gamedev/)
[^2]: https://github.com/dart-lang/dart_style/issues/1683
[^3]: https://github.com/dart-lang/dart_style/issues/534
