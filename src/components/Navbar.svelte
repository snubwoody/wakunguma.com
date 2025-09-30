<script lang='ts'>
    import {Sun,Moon} from "@lucide/svelte/icons";
    import {type Theme} from "../lib/theme";
    import type { ThemeRequest } from "../pages/api/theme";

    const switchTheme = async (theme:Theme) => {
        localStorage.setItem("theme",JSON.stringify(theme));
        const body: ThemeRequest = {
            theme
        };
        
        await fetch("/api/theme",{
            method: "POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify(body)
        });

        const element = document.querySelector("html");
        element?.setAttribute("data-theme",theme);
    };
</script>
<nav class='w-full bg-page flex p-20 items-center justify-between border-b border-border-neutral'>
    <div class="flex items-center gap-20">
        <a href="/" aria-label="Home" class="text-h6">WAKU</a>
        <a href="/blog" aria-label="Blog" class="btn-underline">Blog</a>
    </div>
	<div class="flex items-center gap-16">
        <button
            onclick={() => switchTheme("light")}
            aria-label="Toggle light mode"
            class='light:hidden'
        >
            <Sun size='20' class='relative z-50'/>
        </button>
        <button
            onclick={() => switchTheme("dark")}
            aria-label="Toggle dark mode"
            class='dark:hidden'
        >
            <Moon size='20' strokeWidth='2.25' class='relative z-50 text-black'/>
        </button>
		<a href="https://github.com/snubwoody" aria-label="Github profile" class="github-link"></a>
	</div>
</nav>

<style>
	.github-link{
		width: 24px;
		aspect-ratio: 1/1;
		background-size: cover;
        background-image: url('/icons/github-mark.svg');
        
        :global([data-theme="dark"]) & {
            background-image: url('/icons/github-mark-white.svg');
        }
	}

	button{
		padding: 8px;
		border-radius: inherit;
	}
</style>
