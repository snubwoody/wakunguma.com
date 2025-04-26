<script>
	let {class:className,...props} = $props();
</script>

<nav {...props} class='w-full bg-page flex p-32 items-center justify-between border-b border-border-neutral'>
	<a href="/" aria-label="Home" class="home-link">
	</a>
	<a href="https://github.com/snubwoody" aria-label="Github profile" class="github-link">
	</a>
</nav>

<style>
	.home-link{
		width: 32px;
		aspect-ratio: 1/1;
		background-size: cover;
		background-image: url("../../assets/Logo - Black.svg");
		
		[data-theme="dark"] &{
			background-image: url("../../assets/Logo - White.svg");
		}
	}

	.github-link{
		width: 32px;
		aspect-ratio: 1/1;
		background-size: cover;
		background-image: url("../../assets/github-mark.svg");
		
		[data-theme="dark"] &{
			background-image: url("../../assets/github-mark-white.svg");
		}
	}
</style>