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
COPY . .
RUN npm install
RUN npm run build
CMD [ "npm","run","start" ]
```


**TODO**

- Switch to pnpm and yarn
- Omit dev dependencies
- Next standalone
- From scratch
  
**Tips**

- Make sure to include unneccessary folders like .git and node_modules in your docker ignore