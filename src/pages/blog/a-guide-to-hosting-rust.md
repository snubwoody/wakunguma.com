---
title: A guide to hosting rust
preview: "false"
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

## Virtual machines
The benefit of virtual machines is that you are billed on hourly usage, which means you can't get [extremely large bills](https://www.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/) on accident. Because rust is so lightweight you could genuinely get a long way with a small machine if you configure things right. However that control comes with more complexity. VM's are usually bare metal so they come with very little out the gate, meaning you are going to have to install rust and any other software before getting started. For services you have:
- [Amazon EC2](https://aws.amazon.com/pm/ec2/)
- [DigitalOcean Droplets](https://www.digitalocean.com/products/droplets)
- [GCP Compute Engine](https://cloud.google.com/products/compute?hl=en)
- [Azure Virtual Machines](https://azure.microsoft.com/en-ca/products/virtual-machines/)

There isn't much of a different between the virtual machines themselves, it's more of a different between the platforms. Each of the platforms come's with their own pros and cons. Although azure, being owned by Microsoft, tends to have better support for windows vms and windows related tooling.
## Digital ocean droplets

[DigitalOcean Droplets](https://docs.digitalocean.com/products/droplets/how-to/create/) are Linux-based virtual machines (VMs) that run on top of virtualized hardware. Each Droplet you create is a new server you can use, either standalone or as part of a larger, cloud-based infrastructure.

## Containerised apps


## Fly.io
Fly provides a good medium between control and convenience, with a single command you can get your application running. You can use a docker image or specify a build command (check).

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

## Supabase
Supabase is a baas but it does come with authentication and a database with a generous free tier.

## Hosting
And of course you always have the option of hosting on your own computer, to do this you would need a static ip address, one that can be accessed from the whole internet, then you would probably need an nginx setup to route specific ports. 



### Pricing comparison?
| VM                          | Memory  | vCpus | SSD    | $/month |
| --------------------------- | ------- | ----- | ------ | ------- |
| Digital ocean basic droplet | 512 Mib | 1     | 10 GiB | $4.00   |