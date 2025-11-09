---
title: Why is windows so slow
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: Dozens of services, only one app
image: /thumbnails/hosting-rust.png
imageAsset: ../assets/thumbnails/hosting-rust.png
imageSize: 12
published: 2025-05-23
tags:
  - Windows
---

- Disk usage
- Anti-virus
- IO

I haven't used Linux in a while, but I remember when I did I would be **quite**
shocked at the low resource use while I was using my PC, coming from Windows. 

My ram usage is consistently closer to 100% even though my computer is not doing 
anything worthwhile.

![](../assets/windows-performance/ram-screenshot.png)


![](../assets/windows-performance/process-screenshot.png)

I wonder if this is due to the fundamental design of the operating system architecture
or just accumulating crap over the years.  I rarely ever use windows with a ram usage <60%

Maybe it's Docker and I forgot to drop some images.

```bash
docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
# No images
```

But that's not it.


Most applications in windows run separate background processes, for updating,
telemetry and so on.


```bash
tasklist | findstr /i "Figma"

Figma.exe                    16716 Console                    1     37,980 K
Figma.exe                     1540 Console                    1      1,504 K
Figma.exe                    19380 Console                    1     11,912 K
Figma.exe                    15800 Console                    1     16,420 K
Figma.exe                     1464 Console                    1      2,364 K
Figma.exe                    26112 Console                    1     20,316 K
figma_agent.exe              22168 Console                    1      5,488 K
```

```bash
tasklist | findstr /i "node"

node.exe                     89960 Console                    1     57,056 K
node.exe                     88732 Console                    1  1,169,024 K
node.exe                     70220 Console                    1        144 K
node.exe                     89944 Console                    1    327,988 K
node.exe                     66208 Console                    1    451,376 K
node.exe                     56784 Console                    1    148,464 K
node.exe                     64012 Console                    1     59,576 K
```

I consider myself a power user, but I still think these results apply to people in general.
