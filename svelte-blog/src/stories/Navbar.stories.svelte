<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';
	import Navbar from '../lib/components/Navbar.svelte'
	
	const { Story } = defineMeta({
		title: 'Components/Navbar',
		tags: ['autodocs'],
		component: Navbar
	});
</script>

<Story name="Light"/>

