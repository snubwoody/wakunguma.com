---
title: How everything became a Web App
author: Wakunguma Kalimukwa
published: 2025-06-23
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/rust-weird-expressions.png
imageAsset: ../assets/thumbnails/rust-weird-expressions.png
imageSize: 1200000
synopsis: Everything is a web app these days, but it wasn't always like that.
preview: false
tags:
  - Apps
---

You may have noticed that a lot of software these days is a web app, but it wasn't always like that.

There's two sides to the web apps: websites and apps packed using a webview, electron, tauri and so on.


## Performance
A native app will usually have better performance that an equivalent app written in Electron or otherwise framework using a WebView. All web apps have the overhead of of a web view plus all the other browser technologies running. With native apps you only pay for what you use.

## Feel
Native apps usually feel better than web apps although this is subjective. Native apps like Excel (written in C++) feel more responsive than Notion. Of course this is just a generalisation, there's app like Obsidian where you can't even tell.

## Features
Certain features and categories of apps just need to use system API's. A file explorer, for example, is not feasible to create as a web app. Even basic controls like the camera are heavily guarded on the web.

## Security
Web apps are just more secure put straight, browsers have gone through great lengths to expose as little as possible about the underlying operating system. On Android and IOS similar efforts have been made, as apps are sandboxed and only allowed to access their own resources, but on desktop it's fair game. Apps on desktop are simply executables and there's not that many
restrictions on what resources a desktop app can access.

## Lack of tooling

There is a lack of tooling when it comes to desktop, on mobile you have Kotlin and Java for android and swift for IOS.

The priorities of developers and companies are completely opposite, companies would like it if the whole world only used their OS, it would make them an illegal monopoly, but they would make the most money. On the other hand developers would like it if they could make one app and distribute it everywhere: "Write once, run anywhere". So many operating systems have system libraries and native features that aren't made easily accessible to developers, at least not in ways the manufacturers didn't intend for it.

For example, to compile to MacOS and IOS you need XCode, there is no way around it, which means you will need some kind of Mac device.


### Windows
On windows there have been **many** native toolkits, but Microsoft doesn't seem to manage these for very long.

- [WPF](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/overview/)
- [WinRT](https://learn.microsoft.com/en-us/windows/apps/develop/platform/csharp-winrt/)
- [Windows forms](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/overview/)

### MacOS
MacOS is probably the best when it comes to actually supporting toolkits, on Macs you can use SwiftUI to create desktop apps, throughout the years Apple has updated this toolkit and it typically receives with every major version of Apple OS's. The only issue is that is closed source, which is usual for Apple but very unusual for developer tools. It's very rare to find a library that's not open source, even if it interacts with closed source tech, Window's API's are all open source and the whole of Linux of open source. I bring up this issue because, while SwiftUI has great support, documentation and guides are few and far between, has it been open source these would have been community driven.

### Linux
On Linux I'm not really sure if native has a meaning but there's
[Gtk](https://docs.gtk.org/gtk4/) and [Qt](https://www.qt.io/).

## Indie devs
As an indie dev or small group, you just don't have the time and resources to create apps for multiple platforms with the **same quality**. So reaching for a web app will save you an enormous amount of time.

## Seamless updates
Updates to the web are automatic.

Updates for apps can be quite a convoluted process, if you published to an app store, you have to submit your app for verification, this can take a few hours to a few weeks. Or if you app uses installers like `msi` then it will have to manually update itself or uses will have to install new updates every time one comes out.

## What happened to all the native toolkits?


...Overtime developers gravitated towards web apps.



## Ease of use
Web apps can be deployed anywhere and everywhere.

## Resources
- Post on Substack?
- Start a LinkedIn
