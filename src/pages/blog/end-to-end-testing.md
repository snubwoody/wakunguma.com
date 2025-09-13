---
preview: false
title: The stress of end to end testing
author: Wakunguma Kalimukwa
synopsis: 
layout: ../../layouts/BlogLayout.astro
image: /thumbnails/hosting-rust.png
imageSize: 13024
published: 2025-08-07
tags:
  - Testing
---
This is a minor rant.

I have spent hours debugging and fixing end to end tests, it's often not the tests themselves, but everything around them; their environment. I'm specifically talking about web development, but I assume it could be applied to other areas of development as well.

At first glance end to end testing seems like a great idea. You get to simulate the website how a typical user would. Check if this button works, check if that link redirects to that page. But the cost of these tests is enormous.

The setup needed to run these tests is a lot, playwright needs to install a whole suite of browsers. Along with that it also need system dependencies in CI. You can cache the browsers, but you can't cache the dependencies, unless you know the path of each one of them.

Tests are more likely to be brittle, let's day you have a list that you were testing.

```ts
import { test, expect } from "@playwright/test";

test("",({page})=>{
	page.getByRole("div")
});
```


Actions are done through CDP, a network protocol.

I used to put a lot more of my efforts into end to end testing, but now I'm rethinking that.

I'm specifically talking about playwright.

It takes long in CI, it's hard to get a reproducible environment.

You have to download a whole suite of browsers, that is no small feat. 

Playwright tests take long as well.

End to end are the only types of tests that I have spent hours debugging, fixing and waiting on, I don't think the value they bring is all that worth it.

At first glance it seems logical, you can go through the website, just like a user would. Clicking and navigating as usual.

I've come to the realisation that 

They take long in CI, which is especially bad if you value small, focused commits, the productivity just goes down so much when you have to wait 20 minutes + for everything to run.

With modern frontend frameworks component tests should be trivial with vitest.

Tests are also much more likely to be flakey, since tests are fighting for resources.

In a CI/CD pipeline you need to install browsers and other system dependencies before you can begin. Since runners come with only essential tools, this takes a while.

End to end tests, by their nature, can take a long time to run. The browser is in control of how fast events get resolved, if you're testing involves multiple navigations, it can easily take more than a few seconds. If you have a suite of dozens of tests this builds up, even if they are run in parallel.

I feel that end to end tests should be used for extremely important things, maybe like a like a login form. But for simple things like checking the title of a web page, it is not nearly worth the trouble.

Maintenance burden is high with end to end tests, the higher the burden, the less likely developers are to write tests are even care.

End to end tests are most of the time meant for testing that something's not broken rather than it works. There's a minor but important distinction there, when you test a function, you're testing that it works: `input -> function -> output`. When you test using playwright, it's more so that you're testing that things aren't broken all over the place.

It feels like the time spent running end to end tests is exponential, one more test, can be run multiple times. In the three major browser engines on desktop and on mobile.

As your app grows your end to end suite will grow as well, starting at minutes and eventually going into hours. 

I think end to end tests for simple things are just not worth it.
