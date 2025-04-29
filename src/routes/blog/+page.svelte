<script lang='ts'>
    import BlogPost from "$lib/components/BlogPost.svelte";
    import type { PageProps} from "./$types";

	const items = [0,20,24,5,3,7,10];
    const {data}: PageProps = $props();

    const posts = data.posts;
</script>

<main class='p-24 md:px-64 md:py-56 space-y-44'>
	<h1 class="max-md:text-h3">Browse articles</h1>
	<ul class='blog-grid'>
		{#each posts as post,index (index)}
			<li>
				<BlogPost 
					url={post.url}
					author={post.metadata.author}
					publishDate={post.metadata.published}
					synopsis={post.metadata.synopsis}
					image={post.metadata.image}
				/>
			</li>
		{/each}
	</ul>
</main>

<style>
    .blog-grid{
        display: grid;
        gap: 44px;
        grid-template-columns: repeat(auto-fill,minmax(min(350px,100%),1fr));
    }
</style>
