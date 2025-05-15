---
title: A guide to hosting rust
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: Today we'll go over interesting nightly rust features
image: /thumbnails/rust-nightly-features.png
imageSize: 12
published: 2025-12-12
---
**Hosting services:**
- Google cloud VM's
- Amazon EC2
- Azure VM's
- Cloud run
- Heroku
- Linode
- Fly io
- Railway
- Render
- Digital ocean

**Todo:**
- Make a distinction between services that pay per request vs monthly usage.

Figuring out which services to use can be more complex that actually building the app itself. All the information is written at the time of this post 2025-02-12.

## Virtual machines
The benefit of virtual machines is that you are billed on hourly usage, which means you can't get [extremely large bills](https://www.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/) on accident. Because rust is so lightweight you could genuinely get a long way with a small machine if you configure things right. However that control comes with more complexity. VM's are usually bare metal so they come with very little out the gate, meaning you are going to have to install rust and any other software before getting started. For services you have:
- [Amazon EC2](https://aws.amazon.com/pm/ec2/)
- [DigitalOcean Droplets](https://www.digitalocean.com/products/droplets)
- [GCP Compute Engine](https://cloud.google.com/products/compute?hl=en)
- [Azure Virtual Machines](https://azure.microsoft.com/en-ca/products/virtual-machines/)

There isn't much of a different between the virtual machines themselves, it's more of a different between the platforms. Each of the platforms come's with their own pros and cons. Although azure, being owned by Microsoft, tends to have better support for windows vms and windows related tooling.

Need to setup a firewall...

## Containerised apps
Aws lamdba and/or fargate
Containerised apps allow you to define a container that has everything you need, which is then run using a single command.
- [Google Cloud Run](https://cloud.google.com/run?hl=en)
- [Azure Container Apps](https://azure.microsoft.com/en-ca/products/container-apps/)
- [AWS App Runner](https://aws.amazon.com/apprunner/)
Each provider has their own dedicated hosting service which could provide convenience, or you could use other services like docker hub or github packages. Unfortunately none of these services have any form of budget control apart from budget alerts, which definitely feels intentional. It's rare but if you have a sudden spike of unexpected usage you could definitely end up paying much more than you expected. One way, however daunting, is to use a pub sub system to listen for a budget alert then send a signal to kill whatever service was causing that alert.

```Dockerfile
FROM rust:1.86-bookworm as builder

FROM alpine as runner
COPY --from=builder ./ ./
```

Containerised apps are usually billed per request...

### Google Cloud Run
Cloud run allows you to deploy container images as services or jobs. A service is a long running, auto scaling vm that can scale to 0 when not being used. A job is a serverless function the exits after it has finished running. You can execute jobs on via the rest api, terminal or on a schedule. For a backend you'll create a service and deploy you docker image to one of the [supported registries](https://cloud.google.com/run/docs/deploying#images), but google has artifact registry which has the best support and integration.
## Fly.io
Fly provides a good medium between control and convenience, with a single command you can get your application running. You can use a docker image or specify a build command (check). Fly has machines, volumes, managed postgres, gpus, kubernetes and more, all while making more approachable for people not experienced in DevOps. A machine is your typical virtual machine, an app is your entire program, which can contain machines, gpus, a database and so on.

```bash
fly deploy
```

Fly uses a `fly.io` config file, which you can use to control various things such as regions, memory, networking and even additional services like redis and postgres.

```toml
app = "my-app"
region = "ams"

[http_service]
	internal_port = 8080
	force_https = true
	auto_stop_machines = "false"
	auto_start_machines = true 
	min_machines_running = 0

[env]
	RUST_LOG = "debug"
	PORT = 8080
```

### Pricing

#### Payment limits

> We _do_ have prepaid support. You can buy $25 or more of credits and we suspend the account when credits are exhausted.

### Drawbacks
Fly io lacks a structured logging system which many other hosting services provide.

## Baas
Typically a backend as a service is meant to be used entirely as a backend with client libraries supporting it. But there are perks when it comes one with rust. They come with global hosting, a managed database, authentication, storage and other features. It's basically a mini aws with a very generous free tier. However you'll find little to no documentation of using these without the client libraries as that's what they're heavily advertised for.  
## Supabase
Supabase is a baas so it's meant to be used entirely as a backend, but it does come with authentication and a database with a generous free tier. So it's not uncommon to use Supabase purely for the authentication and database. Even though there is no official rust client library, you can actually use most, if not all, of the services through the REST api. The docs have little to no information on this but all their repositories are listed on their [github org](https://github.com/supabase) with documentation on how to use them.

todo...

## Firebase

## Hosting
And of course you always have the option of hosting on your own computer, to do this you would need a static ip address, one that can be accessed from the whole internet, then you would probably need an nginx setup to route specific ports. 

## Serverless functions


### Pricing comparison?
Pricing is important however it's very dependant on the region, provider and config. But I have included a small pricing comparison using the same specs on the most basic machine on each platform.

| VM                          | Memory  | vCpus | SSD    | $/month |
| --------------------------- | ------- | ----- | ------ | ------- |
| Digital ocean basic droplet | 512 Mib | 1     | 10 GiB | $4.00   |
