<script>
    import { themeStore } from "$lib/theme.svelte";
    import ThemeSwitch from "./ThemeSwitch.svelte";
    import logoBlack from '$lib/assets/icons/logo-black.svg';
    import logoWhite from '$lib/assets/icons/logo-white.svg';
    import githubLogo from '$lib/assets/icons/github-mark.svg';
    import githubLogoWhite from '$lib/assets/icons/github-mark-white.svg';

    // const {theme} = themeStore;
	
	let {...props} = $props();
</script>

<nav {...props} class='w-full bg-page flex p-32 items-center justify-between border-b border-border-neutral'>
	<a href="/" aria-label="Home" class="home-link">
        {#if theme() === 'light'}
            <img src={logoBlack} alt="">
        {:else}
            <img src={logoWhite} alt="">
        {/if}
	</a>
	<div class="flex items-center gap-24">
		<ThemeSwitch/>
		<a href="https://github.com/snubwoody" aria-label="Github profile" class="github-link">
            {#if theme() === 'light'}
                <img src={githubLogo} alt="">
            {:else}
                <img src={githubLogoWhite} alt="">
            {/if}
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
