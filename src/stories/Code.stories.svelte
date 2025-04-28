<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	
	const { Story } = defineMeta({
		title: 'Components/Code',
		tags: ['autodocs'],
	});
</script>

<Story name="Light">
	<code class="code">cargo run --bin app</code>
</Story>

<Story name="Dark">
	<code data-theme="dark" class="code">
		cargo run --bin app
	</code>
</Story>
