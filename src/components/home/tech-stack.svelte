<script lang="ts">
    import { PlusIcon } from "@lucide/svelte";
    import {Accordion,type AccordionItem} from "melt/builders";
    import { slide } from "svelte/transition";
    
    type Item = AccordionItem<{
        title: string,
        body: string
    }>;

    const items: Item[] = [
        {
            id: "rust",
            title: "Rust", 
            body: "I use rust due to it's ephasis on performance, robustness and speed. When I deploy rust code I can be sure it's working and rarely have any issues in production."
        },
        {
            id: "go",
            title: "Go", 
            body: "Go's fast compile times and simple type system helps to get projects up and running extremely quickly."
        },
        {
            id: "flutter",
            title: "Flutter", 
            body: "Flutter allows me to build cross-platform apps without worrying about the specific details of each operation system."
        },
        {
            id: "astro",
            title: "Astro", 
            body: "I try to use astro as much as possible to build performant, SEO-friendly websites. ps: this website is made using astro."
        },
        {
            id: "svelte",
            title: "Svelte", 
            body: "I use svelte in situations where I need a lot of state management without the need for hevier frameworks."
        }
    ];

    const accordion = new Accordion();

    $effect(() => {
        const elements = document.querySelectorAll("[data-observe]");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.setAttribute("data-visible","true");
                }
            });
        });
        
        elements.forEach(el => observer.observe(el));
    });
</script>

<section class="px-24 md:px-64 py-80 flex max-md:flex-col gap-64">
    <header class="space-y-12 flex-1">
        <div class="landing-page-heading">
            <h2 data-observe>Tech stack</h2>
        </div>
        <p data-observe>
            I believe in selecting the right tools for each project, always with an eye towards efficiency and innovation. 
        </p>
    </header>
    <ul {...accordion.root} class="flex-1 space-y-24">
        {#each items as i (i.item.id)}
            {@const item = accordion.getItem(i)}
            <li class="accordion">
                <button {...item.trigger}>
                    <h5>{item.item.title}</h5>
                    <PlusIcon size='20'/>
                </button>
                {#if item.isExpanded}
                    <div transition:slide {...item.content}>
                        {item.item.body}
                    </div>
                {/if}
            </li>
        {/each}
    </ul>
</section>

<style>
    .accordion{
        background: var(--color-light-green);
        color: var(--color-dark-green);
        padding: 24px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: all 250ms;
    
        button{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        h5{
            color: inherit;
        }

        &:has([data-state="open"]){
            background: var(--color-dark-green);
            color: var(--color-light-green);
        }
    }
</style>
