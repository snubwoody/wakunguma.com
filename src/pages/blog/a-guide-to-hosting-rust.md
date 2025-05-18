---
title: A guide to hosting rust
preview: false
author: Wakunguma Kalimukwa
layout: ../../layouts/BlogLayout.astro
synopsis: Dozens of services, only one app
image: /thumbnails/hosting-rust.png
imageSize: 12
published: 2025-12-12
guid: fe2033b6-34b7-42a3-846a-18cd4d962fbc
---
In 2025 there's a plethora of ways to host a rust app/server, figuring out which services to use can be more complex that actually building the app itself. So this guide will try to cover all the common ways and list the pros and cons. All the information is written at the time of publishing and is subject to change.
## Virtual machines
Some cloud providers offer full control over your environment by giving you access to a virtual machine -- a software-based computer that behaves like a physical one. With this level of control, you typically connect to the VM via SSH, clone your repository, install dependencies, and run your application manually. Since rust is so lightweight you could genuinely get a long way with less resources if you configure things right. Among the most popular providers are:
- [Amazon EC2](https://aws.amazon.com/pm/ec2/)
- [DigitalOcean Droplets](https://www.digitalocean.com/products/droplets)
- [GCP Compute Engine](https://cloud.google.com/products/compute?hl=en)
- [Azure Virtual Machines](https://azure.microsoft.com/en-ca/products/virtual-machines/)

There isn't much of a different between the virtual machines themselves, it's more of a different between the platforms. Each of the platforms come's with their own pros and cons. Virtual machines are great but they can be a lot of maintenance, especially if you need multiple services. Consider using terraform or pulumi if you plan to frequently use VM's.
## Platform as a service
A Platform as a Service (PaaS) abstracts the underlying details of the machinery, ram, firewall, etc and lets you simply deploy your code, usually as a container, and it will auto-scale and manage infrastructure for you. Most services use Docker containers, so you'll want to containerise your app. The typical rust Dockerfile looks something like this:

```dockerfile
FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build and cache dependencies
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim as runner
WORKDIR /app
COPY --from=builder /app/target/release/app /usr/local/bin
ENTRYPOINT ["/usr/local/bin/app"]
```

Once you've built your image push it to a registry such as [Dockerhub](https://hub.docker.com/) [Github Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry). 
### Google Cloud Run
[Google Cloud Run](https://cloud.google.com/run?hl=en) is a fully managed application platform that allows you to deploy container images as services or jobs. For a backend you'll create a service and deploy you docker image to one of the [supported registries](https://cloud.google.com/run/docs/deploying#images). Google also has their own registry, artifact registry, which has the best support and integration.
#### Services
A service is a long lived program which listens and response to incoming requests, e.g. a server. Services are auto scaling and can scale to 0 when not being used, the minimum number of instances can be set to something like `1` to always keep at least one instance on and prevent cold starts. 

First we need to create a repository to upload our image to.

```bash
gcloud artifacts repositories create my-repo \
--location=us-east1 \
--repository-format=docker
```

Now we can tag and push our image to the repo.

```bash
docker tag backend us-east1-docker.pkg.dev/[PROJECT_ID]/my-repo/backend

docker push us-east1-docker.pkg.dev/[PROJECT_ID]/my-repo/backend
```

Image tags need to be in a specific format: `[REGION]-docker.pkg.dev/[PROJECT_ID]/[REPO]/[IMAGE]`. And now we can deploy to cloud run

```bash
gcloud run deploy backend \ 
--image us-east1-docker.pkg.dev/[PROJECT_ID]/my-repo/backend \ 
--region us-east1
```

> Your cloud run service does not have to be in the same region as your repository and there's no performance difference since it's only uploaded once.

Our app can now listen for requests at whatever domain will be given.
#### Jobs
A job will run it's task and exit when it's finished, it's a one-off thing as opposed to a long-lived service. Jobs are typically used for batch processing:
- Sending bulk emails
- Processing csv files
- Data aggregation

You can execute jobs manually through the CLI, REST API or the client libraries, or set the job to be run on a schedule.
## Fly.io
[Fly.io](https://fly.io/) provides a good medium between control and convenience, with a single command you can get your application running. You can use a docker image or specify a build command (check). Fly has machines, volumes, managed postgres, gpus, kubernetes and more, all while making more approachable for people not experienced in DevOps. A machine is your typical virtual machine, an app is your entire program, which can contain machines, gpus, a database and so on.

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

## Render
[Render](https://render.com/) is another platform as a service that allows you to either link your repository and use the rust runtime or deploy a Docker image. The runtime requires a build command, `cargo build --release` and a start command `cargo run --release`.

Render comes with a couple other services:
- Cron jobs
- Postgres
- Redis
- Background workers
## Shuttle 
[Shuttle](https://www.shuttle.dev/) is one of the more unique providers, it's made entirely for rust. You can manage most of your deployment from your source code. Add the `#[shuttle_runtime::main]` attribute to you main function and shuttle will take care of the rest.

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
You can deploy your app using `shuttle deploy`.

### Resources
Shuttle provisions resources through macros; it's probably the least configuration to get started on this list.

#### Postgres
The `#[shuttle_shared_db::Postgres]` attribute is used to add a postgres database to our app.

```rust
use shuttle_runtime::SecretStore;
use shuttle_axum::ShuttleAxum;
use axum::{routing::get,Router};
use sqlx::PgPool;

#[shuttle_runtime::main]
async fn main(
	#[shuttle_shared_db::Postgres] pool: PgPool
) -> ShuttleAxum{
	let state = AppState::new(pool).await?;
	let router = Router::new()
		.with_state(state);
	Ok(router.into())
}
```

The output can be configured a couple different ways including:

```rust
use diesel_deadpool::Pool;
/// Use the connection string
async fn main(#[shuttle_shared_db::Postgres] conn_str: String) -> ... {...}

/// Connect to a sqlx postgres pool
async fn main(#[shuttle_shared_db::Postgres] pool: sqlx::PgPool) -> ... {...}

/// Use diesel 
async fn main(
	#[shuttle_shared_db::Postgres] pool: Pool<diesel_async::AsyncPgConnection>
) -> ... {...}
```
#### Secrets
Secrets are read from a `Secrets.toml` file at the root of your project.

```toml
DATABASE_URL="postgresql://postgres:db0909@localhost:5432/postgres"
API_KEY="my-secret-key"
```

Now add `#[shuttle_runtime::Secrets] secrets: SecretStore` to your main function.

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

Behind the scenes deployments are run on AWS EC2 with Fargate, with 0.25 vCPU's and 500 MB RAM as a default. Scaling...

Shuttle is designed the way most rust web apps are built: a framework, database and secret manager. It is **very** opinionated, which is by design, when it works it works well. However it might not be exactly attuned to your use case and there's not much leeway to customise things.
## Supabase
[Supabase](https://supabase.com/) is an open source backend as a service and is meant to be used entirely as a backend with client libraries supporting it. However it does comes with a managed database and authentication, which you can connect to directly, so there are merits to using it with rust. 

You can use a library like `sqlx` to connect directly to the database using a connection string `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`.

You would still have to host your rust app on another other platforms. Even though there is no official rust client library, you can actually use most, if not all, of the services through the REST API. The docs have little to no information on this but all their repositories are listed on their [github org](https://github.com/supabase) with documentation on how to use them.
## Self-hosting
And of course you always have the option of hosting on your own computer/server. I don't think many people would do this, but I'll include it for perspective. There's a few different ways to do this, none of which are advised for your personal device.

First we need to expose our device to the internet, for security our local device IP address is private and changes frequently. The router, however, does have a static IP. When you do this, you're exposing your device to the entire internet as it is, there could be vulnerabilities you might not even know about. Any app could have a `auth.json` file is some folder, or personal pictures.

Go into your router settings and forward a port to the LAN IP of your device. Now the device can publicly be accessed at this port. You can find the public IP of this router at [whatismyip.com](https://www.whatismyip.com/). You can also use a paid service like [ngrok](https://ngrok.com/docs/getting-started/) or [localtunnel](https://theboroer.github.io/localtunnel-www/) which will tunnel to a specific port and give you a public url.

You go into your router configuration and forward port 80 to the LAN IP of the computer running the web server.

Buy a domain and point it to your static ip.

Now that every one is the world can connect to your server, you'll probably want some protection. A firewall is a good start.

And now it's important that this server is always on 24/7.
## Pricing comparison
You may have noticed that I didn't include pricing on any of these. Pricing is important however it's very dependant on the region, provider and config. Most of the above services are free to very cheap for small projects, but the more you need, the more you pay. I would have liked to include a comprehensive pricing table but it varies so much so I'll just link the relevant pages.
- [Cloud Run](https://cloud.google.com/run/pricing)
- [Google pricing calculator](https://cloud.google.com/products/calculator?hl=en)
- [Shuttle](https://www.shuttle.dev/pricing)
- [Supabase](https://supabase.com/pricing)
- [Fly.io](https://fly.io/docs/about/pricing/)

Unfortunately these services usually don't have any form of budget control apart from budget alerts, which feels slightly intentional. It's rare but if you have a sudden spike of unexpected usage you could definitely end up [paying much more](https://www.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/) than you expected. One way, however daunting, is to use a pub sub system to listen for a budget alert, then send a signal to kill whatever service was causing that alert.

