<script lang="ts">
    import type {BlogPost} from "../lib";
    import { formatDate } from "../lib/format";

    type Props = {
        posts: BlogPost[]
    }

    const {posts}: Props = $props();

    let currentFilter = $state("All");
    let filters: Map<string,number> = new Map();
    filters.set("All",posts.length);

    posts.forEach(post => {
        const tags = post.frontmatter.tags;
        for (const tag of tags){
            let count = filters.get(tag);

            if (!count){
                filters.set(tag,1);
                continue
            }

            filters.set(tag,count+1);
        }
    })

    let filteredPosts: BlogPost[] = $state([]);
    $effect(()=>{
        if (currentFilter === "All"){
            filteredPosts = posts
            return
        }

        filteredPosts = posts.filter(post => post.frontmatter.tags.includes(currentFilter))
    })
</script>

<section class="p-24 md:px-40 md:py-44 space-y-36">
    <header class="space-y-12">
        <h3>Articles</h3>
        <ul class="flex gap-12 items-center">
            {#each filters.entries() as filter}
                <li data-selected={currentFilter === filter[0]} class=filter-chip>
                    <button onclick={() => currentFilter = filter[0]} class="flex items-start gap-4">
                        {filter[0]}
                        <span class="text-xs">{filter[1]}</span>
                    </button>
                </li>
            {/each}
        </ul>
    </header>
    <ul class="blog-grid">
        {#each filteredPosts as post}
            <li>
                <a href={post.url} class="blog-post" data-astro-prefetch>
                    <img src={post.frontmatter.image} alt="Thumbnail" class="rounded-md">
                    <div class="grid place-items-center p-12">
                        <h4 class="mb-8 max-md:text-h5 font-bold text-center">{post.frontmatter.title}</h4>
                        <p class="text-sm">
                            {formatDate(post.frontmatter.published)}
                        </p>
                    </div>
                </a>
            </li>
        {/each}
    </ul>
</section>

<style>
    .filter-chip{
        display: grid;
        place-items: center;
        border: 1px solid transparent;
        transition: 150ms all;
        padding: 4px 12px;
        border-radius: var(--radius-full);
        cursor: pointer;

        &:hover{
            border-color: var(--color-purple-100);
        }

        &[data-selected="true"]{
            background-color: var(--color-purple-100);
            color: var(--color-neutral-950);
        }

        :global([data-theme="light"]) &:hover{
            border-color: var(--color-purple-500);
        }

        :global([data-theme="light"]) &[data-selected="true"]{
            background-color: var(--color-purple-500);
            color: var(--color-purple-50);
        }
    }
</style>
