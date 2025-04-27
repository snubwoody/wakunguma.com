<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlogPost from '$lib/components/BlogPost.svelte';
	
	const { Story } = defineMeta({
		title: 'Components/Blog post',
		tags: ['autodocs'],
		component: BlogPost,
		args:{
			url:'https://example.com',
			image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			author: 'Wakunguma Kalimukwa',
			publishDate: '1st January, 2024',
			synopsis: 'exercitationem vitae fuga facilis ea itaque aut ex nam, nesciunt reiciendis, nostrum ipsa expedita maxime veritatis natus voluptatum possimus sed magni!'
		},
	});
</script>

<Story name="Light"/>

<Story name="Dark" args={{"data-theme":"dark"}}/>