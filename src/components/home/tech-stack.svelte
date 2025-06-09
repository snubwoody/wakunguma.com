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
            id: 'rust',
            title: 'Rust', 
            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            id: 'go',
            title: 'Go', 
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            id: 'flutter',
            title: 'Flutter', 
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            id: 'astro',
            title: 'Astro', 
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
            id: 'svelte',
            title: 'Svelte', 
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
    ];

    const accordion = new Accordion();
</script>

<section class="px-240 md:px-64 py-80 flex max-md:flex-col gap-64">
    <header class="space-y-12 flex-1">
        <div class="landing-page-heading">
            <h2>Tech stack</h2>
        </div>
        <p>
            I believe in selecting the right tools for each project, always with an eye towards efficiency and innovation. 
        </p>
    </header>
    <ul {...accordion.root} class="flex-1 space-y-24">
        {#each items as i}
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
