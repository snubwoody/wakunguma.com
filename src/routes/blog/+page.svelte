<script lang='ts'>
    import BlogPost from "$lib/components/BlogPost.svelte";

	const items = [0,20,24,5,3,7,10];
</script>

<main class='p-24 md:px-64 md:py-56 space-y-44'>
	<h1 class="max-md:text-h3">Browse articles</h1>
	<ul class='blog-grid'>
		{#each items as item (item)}
			<li>
				<BlogPost 
					url='/'
					author='Wakunguma Kalimukwa'
					publishDate='1st January 2024'
					synopsis="exercitationem vitae fuga facilis ea itaque aut ex nam, nesciunt reiciendis, nostrum ipsa expedita maxime veritatis natus voluptatum possimus sed magni!"
					image='https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
				/>
			</li>
		{/each}
	</ul>
</main>

<style>
    .blog-grid{
        display: grid;
        gap: 44px;
        grid-template-columns: repeat(auto-fit,minmax(min(350px,100%),1fr));
    }
</style>
