<script lang='ts'>
    import {Sun,Moon} from '@lucide/svelte/icons';
    import {type Theme} from '../lib/theme';
    import type { ThemeRequest } from '../pages/api/theme';

    const switchTheme = async (theme:Theme) => {
        let body: ThemeRequest = {
            theme
        };
        
        await fetch('/api/theme',{
            method: "POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify(body)
        });

        const element = document.querySelector("html");
        element?.setAttribute("data-theme",theme);
    }
</script>
<nav
    aria-label="Navigation bar"
    class='w-full bg-page flex p-20 items-center justify-between border-b border-border-neutral'
>
    <div class="flex items-center gap-32">
        <a href="/" aria-label="Home" class="home-link">
        </a>
        <a href="/blog" aria-label="Blog" class="btn-underline">Blog</a>
    </div>
	<div class="flex items-center gap-24">
        <div 
            aria-label="Theme switcher" 
            class='theme-switcher'
        >
            <button 
                onclick={() => switchTheme('light')}
                aria-label="Light mode" 
                class='light-mode'
                >
                <Sun size='20' class='relative z-50'/>
            </button>
            <button 
                onclick={() => switchTheme("dark")}
                aria-label="Dark mode" 
                class='dark-mode'
            >	
                <Moon size='20' strokeWidth='2.25' class='relative z-50 text-black'/>
            </button>
        </div>
		<a href="https://github.com/snubwoody" aria-label="Github profile" class="github-link">
		</a>
	</div>
</nav>

<style>
	.home-link{
		width: 24px;
		aspect-ratio: 1/1;
		background-size: cover;
        background-image: url('/icons/logo-black.svg');
        
        :global([data-theme="dark"]) & {
            background-image: url('/icons/logo-white.svg');
        }
	}

	.github-link{
		width: 24px;
		aspect-ratio: 1/1;
		background-size: cover;
        background-image: url('/icons/github-mark.svg');
        
        :global([data-theme="dark"]) & {
            background-image: url('/icons/github-mark-white.svg');
        }
	}

    .theme-switcher{
		background-color: var(--color-surface-neutral-dim);
		display: flex;
		width: fit-content;
		gap: 4px;
		padding: 8px;
		border-radius: var(--radius-full);
		align-items: center;
	}

	button{
		padding: 8px;
		border-radius: inherit;
	}

	.light-mode{
		position: relative;
		&::before{
			position: absolute;
			content: '';
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--color-white);
			border-radius: inherit;
			transition: all 150ms;
		}

		:global([data-theme="dark"]) &::before{
			transform: translateX(calc(100% + 4px));
		}
	}
</style>
