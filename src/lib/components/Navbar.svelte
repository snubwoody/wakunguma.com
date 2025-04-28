<script>
    import { themeStore } from "$lib/theme.svelte";
    import ThemeSwitch from "./ThemeSwitch.svelte";
	const {theme} = themeStore;
	
	let {...props} = $props();

	const logoSrc = $derived.by(() => {
		if (theme() === 'light'){
			return '/icons/logo-black.svg'
		}

		return 'icons/logo-white.svg'
	});
	
	const profileSrc = $derived.by(() => {
		if (theme() === 'light'){
			return '/icons/github-mark.svg'
		}

		return 'icons/github-mark-white.svg'
	});
</script>

<nav {...props} class='w-full bg-page flex p-32 items-center justify-between border-b border-border-neutral'>
	<a href="/" aria-label="Home" class="home-link">
		<img src={logoSrc} alt="">
	</a>
	<div class="flex items-center gap-24">
		<ThemeSwitch/>
		<a href="https://github.com/snubwoody" aria-label="Github profile" class="github-link">
			<img src={profileSrc} alt="">
		</a>
	</div>
</nav>

<style>
	.home-link{
		width: 24px;
		aspect-ratio: 1/1;
		background-size: cover;
	}

	.github-link{
		width: 24px;
		aspect-ratio: 1/1;
		background-size: cover;
	}
</style>