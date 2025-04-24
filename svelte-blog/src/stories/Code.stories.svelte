<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Code from './Code.svelte';
	import { fn } from '@storybook/test';
	
	const { Story } = defineMeta({
		title: 'Components/Code',
		component: Code,
		tags: ['autodocs'],
	});
</script>

<Story name="Default"  />
