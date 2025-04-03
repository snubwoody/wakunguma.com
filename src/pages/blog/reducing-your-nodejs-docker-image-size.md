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

## Using a slimmer image

We can use a slimmer image, with node js alphine we cut our size in half to 1.03GB.

**TODO**

- Switch to pnpm and yarn
- Omit dev dependencies
- Next standalone
- From scratch
  
**Tips**

- Make sure to include unneccessary folders like .git and node_modules in your docker ignore