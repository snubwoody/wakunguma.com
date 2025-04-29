<script lang='ts'>
	import type {HTMLAnchorAttributes} from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes{
		url: string,
		image:string,
		author: string,
		publishDate: string,
		synopsis: string
	}

	let {
		url,
		image,
		author,
		publishDate,
		synopsis,
		...props
	}:Props = $props();
</script>

<a href={url} {...props} class="blog-post">
	<img src={image} alt="">
	<div>
		<h4 class="mb-8 max-md:text-h5">{author}</h4>
		<p class="mb-12 max-md:text-sm">By {author} | {publishDate}</p>
		<p class="max-md:text-sm">{synopsis}</p>
	</div>
</a>

<style>

	.blog-post{
        display: flex;
        flex-direction: column;
        gap:36px;
	}

	img{
		width: 100%;
		aspect-ratio: 4/3;
		border-radius: var(--radius-md);
		transition: all 250ms;
		
		:hover &{
			scale: 1.01;
		}
	}
</style>
