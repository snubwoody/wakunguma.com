---
preview: false
title: The stress of end to end testing
author: Wakunguma Kalimukwa
synopsis: End to end tests are stressful
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

So the workflow is:
1. Install the system dependencies (which are hard to cache)
2. Install the browsers
3. Start the web server
4. Start the browsers
5. Run the tests

This whole process could easily take more than 20 minutes and if you practice small, focused commits then this could be what you do for the whole day.

If you spend more time in the CI/CD pipeline that you do coding, something is wrong.

End to end are the only types of tests that I have spent hours debugging, fixing and waiting on, I don't think the value they bring is all that worth it.

End to end tests, by their nature, can take a long time to run. The browser is in control of how fast events get resolved, if you're testing involves multiple navigations, it can easily take more than a few seconds. If you have a suite of dozens of tests this builds up, even if they are run in parallel.

I feel that end to end tests should be used for extremely important things, maybe like a like a login form. But for simple things like checking the title of a web page, it is not nearly worth the trouble.

The maintenance burden is high as well. Let's say you run your test suite in 5 browsers:
- Chrome
- Safari
- Firefox
- Mobile Chrome
- Mobile Safari

Each additional test will need to be run 5 times, giving us an exponential curve of time spent.

End to end tests are most of the time meant for testing that something's not broken rather than it works. There's a minor but important distinction there, when you test a function, you're testing that it works: `input -> function -> output`. When you test using playwright, it's more so that you're testing that things aren't broken all over the place.

It feels like the time spent running end to end tests is exponential, one more test, can be run multiple times. In the three major browser engines on desktop and on mobile.

As your app grows your end to end suite will grow as well, starting at minutes and eventually going into hours. 

Your CI/CD pipeline should ideally be fast, with the setup and execution of end to end tests it can easily take more than 20 minutes. That's 20 minutes to find the bug(s), another `x` amount of minutes to fix the bug(s), another 20 minutes to see if everything worked. If it fails again, you are going to be stressed and you will eventually just move on to other things or push through and be even more tired when everything is working.

Web pages change a lot, with playwright you are usually grabbing elements using locaters, this becomes brittle over time.

If you have a suite of tests that frequently fail and are ignored, that's bad. There's no other way to put it.

Most of the pain of end to end tests is felt in the CI/CD, locally everything probably works okay.
## Unit tests
Unit tests are fast and reliable. Think of it as testing a function: given an input `x`, function `f` will always product the output `y`, until the end of time. If this fails then we know where the code is failing and we know what to fix, or to update the test. This is the same concept as a unit test, break your app into smaller units and test those.

## The sweet spot
As easy and reliable unit tests can be, when it comes to web development they don't represent the whole pie. User's interact with the UI not the functions, so we need some kind of way to test the UI but only the specific parts we want to focus on. That's where component tests come in.
