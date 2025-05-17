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
- Heroku

**Todo:**
- Make a distinction between services that pay per request vs monthly usage.

Figuring out which services to use can be more complex that actually building the app itself. All the information is written at the time of this post 2025-02-12.

## Virtual machines
The benefit of virtual machines is that you are billed on hourly usage, which means you can't get [extremely large bills](https://www.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/) on accident. Because rust is so lightweight you could genuinely get a long way with a small machine if you configure things right. However that control comes with more complexity. VM's are usually bare metal so they come with very little out the gate, meaning you are going to have to install rust and any other software before getting started. For services you have:
- [Amazon EC2](https://aws.amazon.com/pm/ec2/)
- [DigitalOcean Droplets](https://www.digitalocean.com/products/droplets)
- [GCP Compute Engine](https://cloud.google.com/products/compute?hl=en)
- [Azure Virtual Machines](https://azure.microsoft.com/en-ca/products/virtual-machines/)

There isn't much of a different between the virtual machines themselves, it's more of a different between the platforms. Each of the platforms come's with their own pros and cons.

Need to setup a firewall...
Instances that run containers...

First we need to set the default project so that we don't need to pass it into every command.
```bash
gcloud compute set project my-project
```
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
Fly.io strikes a great balance between control and convenience
Fly provides a good medium between control and convenience, with a single command you can get your application running. You can use a docker image or specify a build command (check). Fly has machines, volumes, managed postgres, gpus, kubernetes and more, all while making more approachable for people not experienced in DevOps. A machine is your typical virtual machine, an app is your entire program, which can contain machines, gpus, a database and so on.

```bash
fly deploy
```

Fly uses a [`fly.toml`](https://fly.io/docs/reference/configuration/) config file which you can use to customise everything about you app - it also has json and yaml but toml is the default and advised option.

```toml
app = "my-app"
primary_region = "ams"

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

By default the config will look for a `Dockerfile` in the root directory, if you have multiple dockerfiles you can specify which one to use in the `build` section.

```toml
[build]
	dockerfile = "Dockerfile.staging"
```

In place of a `Dockerfile` a public image can also be used.

```toml
[build]
	image = "postgres"
```

You also have the option to run a `release_command`, which runs after the image has been built but before it's deployed, on a separate temporary machine.

```toml
[deploy]
	release_command = "target/release/migrate"
```
### Drawbacks
Unlike some other providers, fly lacks a structured logging system so you will have to output simple line logs or export your logs to another service.

## Shuttle 
[Shuttle](https://www.shuttle.dev/) is one of the more unique providers, it's made entirely for rust. Add the `#[shuttle_runtime::main]` attribute to you main function and shuttle will take care of the rest.

```rust
use axum::{routing::get,Router};

async fn hello_world() -> &'static str{
	"Hello world!"
}

#[shuttle_runtime::main]
async fn axum() -> shuttle_axum::ShuttleAxum{
	let router = Router::new()
		.route("/",get(hello_world));
	Ok(router.into())
}
```

Your app can now be deployed with a single command:

```bash
shuttle deploy
```

Deployments run in AWS ECS with Fargate VMs.

Secrets are read from a `Secrets.toml` file.

```toml
DATABASE_URL="postgresql://postgres:db0909@localhost:5432/postgres"
API_KEY="my-secret-key"
```

Now pass a `#[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore` as an argument to your main function.

```rust
use shuttle_runtime::SecretStore;
use shuttle_axum::ShuttleAxum;
use axum::{routing::get,Router};

#[shuttle_runtime::main]
async fn axum(
	#[shuttle_runtime::Secrets] secrets: SecretStore
) -> ShuttleAxum{
	let api_key = secrets.get("API_KEY")
		.context("api key not found")?;
	
	let state = AppState::new(api_key).await?;
	let router = Router::new()
		.with_state(state);
	Ok(router.into())
}
```

Shuttle also comes with a managed database, which can be added with a function parameter, just like our secrets.

```rust
use shuttle_runtime::SecretStore;
use shuttle_axum::ShuttleAxum;
use axum::{routing::get,Router};
use sqlx::PgPool;

#[shuttle_runtime::main]
async fn axum(
	#[shuttle_shared_db::Postgres] pool: PgPool
) -> ShuttleAxum{
	let state = AppState::new(pool).await?;
	let router = Router::new()
		.with_state(state);
	Ok(router.into())
}
```

Shuttle is meant to be used the way most rust server are built:
- A framework of your choice
- A database 
- A secret manager 

When it works, it works well. 
## Supabase
Typically a backend as a service is meant to be used entirely as a backend with client libraries supporting it. But there are perks when it comes one with rust. They come with global hosting, a managed database, authentication, storage and other features. It's basically a mini aws with a very generous free tier. However you'll find little to no documentation of using these without the client libraries as that's what they're heavily advertised for. Supabase is a baas so it's meant to be used entirely as a backend, but it does come with authentication, a postgres database and a generous free tier. So it's not uncommon to use Supabase purely for the authentication and database. Even though there is no official rust client library, you can actually use most, if not all, of the services through the REST api. The docs have little to no information on this but all their repositories are listed on their [github org](https://github.com/supabase) with documentation on how to use them.

## Self-hosting
And of course you always have the option of hosting on your own computer/server. I don't think many people would do this, but I'll include it for perspective. There's a few different ways to do this, none of which are advised for your personal device.

First we need to expose our device to the internet, for security our local device IP address is private and changes frequently. The router, however, does have a static IP. When you do this, you're exposing your device to the entire internet as it is, there could be vulnerabilities you might not even know about. Any app could have a `auth.json` file is some folder, or personal pictures.

Go into your router settings and forward a port to the LAN IP of your device. Now the device can publicly be accessed at this port. You can find the public IP of this router at [whatismyip.com](https://www.whatismyip.com/). You can also use a paid service like [ngrok](https://ngrok.com/docs/getting-started/) or [localtunnel](https://theboroer.github.io/localtunnel-www/) which will tunnel to a specific port and give you a public url.

You go into your router configuration and forward port 80 to the LAN IP of the computer running the web server.

Buy a domain and point it to your static ip.

Now that every one is the world can connect to your server, you'll probably want some protection. A firewall is a good start.

And now it's important that this server is always on 24/7.
### Pricing comparison?
Pricing is important however it's very dependant on the region, provider and config. But I have included a small pricing comparison using the same specs on the most basic machine on each platform.

| VM                          | Memory  | vCpus | SSD    | $/month |
| --------------------------- | ------- | ----- | ------ | ------- |
| Digital ocean basic droplet | 512 Mib | 1     | 10 GiB | $4.00   |
