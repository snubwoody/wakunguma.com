<script lang="ts">
	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
    import { themeStore } from '$lib/theme.svelte';
	
	let { children } = $props();
	const {theme} = themeStore;

	$effect(()=>{
		let element = document.querySelector('html');
		element?.setAttribute('data-theme',theme());
	})
</script>

<svelte:head>
	<title>Waku's Blog</title>
</svelte:head>
<Navbar/>
{@render children()}
