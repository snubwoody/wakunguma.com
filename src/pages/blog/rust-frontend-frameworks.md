---
title: 'Rust for the frontend'
author: 'Wakunguma Kalimukwa'
published: '20th April, 2025'
layout: '../../layouts/BlogLayout.astro'
image: 'https://cdn.pixabay.com/photo/2020/04/02/22/05/home-office-4996834_1280.jpg'
synopsis: 'Todo...'
---

Today we will go over the current state of rust frontend frameworks and whether it is viable for use in production.

Currently trunk is used for serving all these frameworks, (check)

## Viable frameworks
- Yew
- Dioxus
- Sycamore
- Leptos

## Testing
## Sycamore
Sycamore compiles to HTML and uses web assembly for rendering.

## Styling
Trunk, and therefore sycamore, has built [in support](https://trunkrs.dev/assets/#css) for CSS. All you have to do is add a link to you CSS file, with `rel=css` and a `data-trunk` attribute to tell trunk to serve it.

```html
<!DOCTYPE html>
<html>
    <head>
        <link data-trunk rel="css" href="styles/app.css">
    </head>
    <body></body>
</html>
```

## Basics
