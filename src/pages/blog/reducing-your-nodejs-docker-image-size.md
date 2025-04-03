---
title: 'Reducing the size of your node js docker image'
author: 'Wakunguma Kalimukwa'
published: '3rd April, 2025'
layout: '../../layouts/BlogLayout.astro'
image: 'https://cdn.pixabay.com/photo/2017/03/11/11/44/man-2134881_1280.jpg'
synopsis: 'Todo...'
---

```json
{
  "name": "app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.2.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}
```

```dockerfile
FROM node:latest
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm","start" ]
```

With our base image we have a size of `2.4Gb` which is a huge amount for the default Next JS setup. Most hosting services pay per GB so you will be paying for your app before it's even deployed.

> Make sure to include unneccessary folders like .git and node_modules in your docker ignore

## Using a slimmer image

We can use a slimmer image, with node js alpine we cut our size in half to 1.03GB.

## Mutli-stage builds

We can slim our final image to only include what we need, to do this we'll need to use multi-stage docker builds.

```dockerfile
FROM node:23-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS builder
# Cache depencies
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=deps /usr/src/app/node_modules  ./node_modules
COPY --from=deps /usr/src/app/package.json /usr/src/app/package-lock.json  ./
COPY --from=builder /usr/src/app/.next ./.next
EXPOSE 3000
CMD [ "npm","run","start" ]
```

Our image is now 887Mb.


## Standalone mode

```dockerfile
FROM node:23-alpine AS builder
WORKDIR /usr/src/app
# Cache depencies
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:23-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next/standalone ./.next/standalone
COPY --from=builder /usr/src/app/.next/static ./.next/standalone/.next/
COPY --from=builder /usr/src/app/public ./.next/standalone/
EXPOSE 3000
CMD [ "node",".next/standalone/server.js" ]
```

Our image size is now 321Mb which is good for most projects.

**TODO**

- Switch to pnpm and yarn
- Omit dev dependencies
- Next standalone
- From scratch