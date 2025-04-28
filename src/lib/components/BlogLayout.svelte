<script lang="ts">
    import type { Snippet } from "svelte";
	import '../../styles/blog.css';

	interface Props{
		children: Snippet,
		author: string,
		title: string,
		published: string,
		image: string,
		synopsis: string,
	}

	let {
		children,
		author,
		title,
		published,
		image,
	}: Props = $props();
</script>

<main class="px-64 flex justify-center">
	<article class="space-y-36 py-40 max-w-[1150px]">
		<img src={image} alt="" class="aspect-[4/3] w-full rounded-md">
		<header class="flex flex-col items-center">
			<h1 class="text-center">{title}</h1>
			<p class="mt-8 mb-4">{published}</p>
			<p>By {author}</p>
		</header>
		<div class="flex px-64 gap-36 justify-center">
			<div class="max-w-[75ch] blog-content">
				{@render children()}
			</div>
			<div>
				<h4>Contents</h4>
			</div>
		</div>
	</article>
</main>

<style>

</style>