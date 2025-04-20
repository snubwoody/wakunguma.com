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

>[!tip] Use #!\[allow(non_snake_case)\] at the top of you rust files to prevent compiler warnings if you want to use PascalCase for component name.
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
Tailwind v4 is not supported (check).

## Syntax
Both sycamore and dioxus have use dsl macros to define the ui. Sycamore uses the `view!` while dioxus uses `rsx!`, the two are very similar but have slight differences.

###### Dioxus
```rust
rsx!{
	h1{"Hello world"}
};
```

###### Sycamore
```rust
view!{
	h1{"Hello world"}
};
```

In sycamore attribute are passed separately in parentheses, while in dioxus everything is comma seperated in brackets.
###### Dioxus
```rust
rsx!{
	nav{
		class: "navbar",
		a{
			href: "/",
			"Home"
		}
	}
};
```
###### Sycamore
```rust
view!{
	nav(class="navbar"){
		a(href="/"){
			"Home"
		}
	}
};
```


### Attributes
Attributes are set using parenthesis.
```rust
fn Greet() -> View{
    view!{
        h1(class="main-heading"){
            "Hello world"
        }
    }
}
```
Events have a slightly different syntax, they use the `on:*` directive.
```rust
fn App() -> View{
    view!{
        button(class="btn",on:click= |_|console_log!("Hello world")){"Subtract"}
        h1{"Hello world"}
        button(class="btn"){"Add"}
    }
}
```
## State management
Both Sycamore and Dioxus use signals for state management, which are inspired by SolidJS.
###### Sycamore
```rust
let count = create_signal(0);
let decrement = move |_|count.set(count.get() - 1);
let increment = move |_|count.set(count.get() + 1);

view!{
	button(class="btn",on:click=decrement){"Subtract"}
	p{(count)}
	button(class="btn",on:click=increment){"Add"}
};
```
###### Dioxus
```rust
let mut count = use_signal(||0);

rsx!{
	button{onclick: move||count -= 1 "Subtract"}
	p{"{count}"}
	button{onclick: move||count -= 1 "Subtract"}
}
```
## Complex state management
We are going to try and imitate a user cart on an e-commerce shopping page.

## Hot reloading
Hot reloading is common and essential to web development.
## Mobile support

## Assets
