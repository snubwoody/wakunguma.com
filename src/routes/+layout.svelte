<script lang="ts">
	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>Waku's Blog</title>
</svelte:head>
<Navbar/>
{@render children()}
