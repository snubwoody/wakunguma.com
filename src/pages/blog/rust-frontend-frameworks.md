---
title: Rust for the frontend
author: Wakunguma Kalimukwa
published: 2025-12-12
layout: ../../layouts/BlogLayout.astro
image: https://cdn.pixabay.com/photo/2020/04/02/22/05/home-office-4996834_1280.jpg
imageSize: 5723169
synopsis: Web assembly has enabled rust to be used on the frontend, and it has come a long way since
preview: true
---

Today we will go over the current state of rust frontend frameworks and whether it is viable for use in production.

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

String interpolation is also slightly different, in sycamore values have to be passed outside the string in parentheses.

```rust
let forename = "John";
let surname = "Doe";

view!{
    p{ "Good evening Mr." (forname) (surname)}
}
```

In Dioxus strings implicitly use `format!()` so values can be passed right into the string.

```rust
let forename = "Rabecca";
let surname = "Stone";

rsx!{
    p{"Hello Ms. {forename} {surname}"}
}
```

In rsx any you can pass any valid rust expression, which will be evaluated at build time.

```rust
rsx!{
	if true{
		"List"
	}
	ul{
		for i in 0..5{
			li{"{i}"}
		}
	}
}
```

## Components

In Dioxus a component is any function that takes in props and returns an `Element`. All props structs need to derive the `Properties` trait which requires `PartialEq` and `Clone`.

```rust
#[derive(Props,Clone,PartialEq)]
struct CartItemProps{
    img_url: String,
    title: String,
    quantity: u32,
    price: f32
}

fn CartItem(props: CartItemProps) -> Element{
	rsx!{
		li {  
			img { src:props.img_url }
			div {
				h5{"{props.title}"}
				p{"{props.quantity}"}
				p{"{props.price}"}
				}
			}
		}
	}
}

fn App() -> Element {
    rsx! {
        CartItem{
            img_url: "https://example.png",
            title: "Soap Dispenser",
            quantity: 2,
            price: 9.99,
        }
    }
}
```

You can use the `#[component]` attribute macro to pass the props directly as function parameters.

```rust
#[component]
fn Button(text:String) -> Element{
	rsx!{
		button{"{text}"}
	}
}
```

Sycamore also has `#[component]` and `Props` attributes. However in sycamore, every function that takes in props must have the component attribute.

```rust
#[derive(Props)]
struct ButtonProps{
    text: &'static str
}

#[component]
fn Button(props:ButtonProps) -> View{
    view!{
        button{(props.text)}
    }
}

#[component]
fn App() -> View{
    view!{
        Button(text="Hello")
    }
}
```

To use inline props you use the `#[component(inline_props)]`.

```rust
#[component(inline_props)]
fn Button(text: &'static str) -> View{
	view!{
		button{(text)}
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
## Async support

## Assets
Dioxus has [asset support](https://dioxuslabs.com/learn/0.6/guide/assets) using the `asset!` macro.
```rust
static CSS: Asset = asset!("assets/main.css");
static PLUS_ICON: Asset = asset!("assets/icons/plus.svg");
static MINUS_ICON: Asset = asset!("assets/icons/minus.svg");
  
#[component]
fn App() -> Element {
    rsx! {
        img { src: PLUS_ICON }
    }
}
```
The `asset!` macro generates a unique path to the asset so that it can be loaded at runtime.
## No macros!
If you prefer not to use macros Sycamore has a builder api.

## Conclusion 
Dioxus has much better IDE support. 
