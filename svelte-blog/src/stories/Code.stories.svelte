<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';
	
	const { Story } = defineMeta({
		title: 'Components/Code',
		tags: ['autodocs'],
	});
</script>

<Story name="Light">
	<pre class="code">
		<code>cargo run --bin app</code>
	</pre>
</Story>

<Story name="Dark">
	<pre data-theme="dark" class="code">
		<code>cargo run --bin app</code>
	</pre>
</Story>
