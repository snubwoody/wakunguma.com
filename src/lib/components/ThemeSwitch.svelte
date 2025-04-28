<script lang="ts">
	import {Sun,Moon} from '@lucide/svelte';
	import {themeStore} from '$lib/theme.svelte';

	const {switchTheme,theme} = themeStore;
</script>

<div 
	aria-label="Theme switcher" 
	class='theme-switcher'
>
	<button 
		onclick={() => switchTheme('light')} 
		aria-label="Light mode" 
		class='light-mode'
	>
		<Sun size='20' class='relative z-50'/>
	</button>
	<button 
		onclick={()=> switchTheme('dark')}
		aria-label="Dark mode" 
		class='dark-mode'
	>	
		{#if theme() === "light"}
			<Moon size='20' strokeWidth='2.25' class='relative z-50'/>
		{:else}
			<Moon size='20' strokeWidth='2.25' class='relative z-50 text-black'/>
		{/if}
	
	</button>
</div>

<style>
	.theme-switcher{
		background-color: var(--color-surface-neutral-dim);
		display: flex;
		width: fit-content;
		gap: 4px;
		padding: 8px;
		border-radius: var(--radius-full);
		align-items: center;
	}

	button{
		padding: 8px;
		border-radius: inherit;
	}

	.light-mode{
		position: relative;
		&::before{
			position: absolute;
			content: '';
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--color-white);
			border-radius: inherit;
			transition: all 150ms;
		}

		:global([data-theme="dark"]) &::before{
			transform: translateX(calc(100% + 4px));
		}
	}

	
</style>