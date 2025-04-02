---
title: 'My first ever article'
author: 'Wakunguma Kalimukwa'
published: '12th Dec, 2024'
layout: '../../layouts/BlogLayout.astro'
image: 'https://cdn.pixabay.com/photo/2020/04/02/22/05/home-office-4996834_1280.jpg'
synopsis: 'Marvel has kept the production of Avengers doomsday under the wraps, but we will go over all the details we know of'
---

It is I Victor von Doom

Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis laboriosam repellat hic temporibus harum sunt ullam accusamus quidem quos vel adipisci maiores sed consequuntur quasi asperiores veniam, earum ex pariatur.

Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis laboriosam repellat hic temporibus harum sunt ullam accusamus quidem quos vel adipisci maiores sed consequuntur quasi asperiores veniam, earum ex pariatur.

Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis laboriosam repellat hic temporibus harum sunt ullam accusamus quidem quos vel adipisci maiores sed consequuntur quasi asperiores veniam, earum ex pariatur.

```dockerfile
FROM node20-apline as base;
WORKDIR /app

FROM base as prod;
RUN npm ci --omit=dev;
```