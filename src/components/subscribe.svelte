<script lang="ts">
    import Input from "./Input.svelte";
    import {Rss,Check} from "@lucide/svelte/icons";
    import { apiV1 } from "../lib";

    let loading = $state(false);
    let success = $state(false);
    let failed = $state(false);
    let email: null | string = $state(null);
    let errorMessage = $state("Something went wrong");

    const subscribe = async () => {
        try{
            loading = true;
            const url = `${apiV1}/subscribe`;
            const response = await fetch(url,{
                method:"POST",
                headers: {
                    "content-type":"application/json"
                },
                body: JSON.stringify({email})
            });

            if (response.ok){
                success = true;   
                setTimeout(() => {
                    success = false;
                    email = "";
                },2500);         
                return;
            }
            const body = await response.json();
            errorMessage = body.details ?? "Something went wrong";
            failed = true;
            setTimeout(() => {
                failed = false;
            },2500);
        }catch{
            failed = true;
            setTimeout(() => {
                failed = false;
            },2500);
        } finally{
            loading = false;
        }
        
    };
</script>

<div class="flex flex-col max-sm:items-center flex-1 max-w-[450px]">
    <h6 class="mb-4">Subscribe</h6>
    <p class="mb-24">Get notified when a new post goes live.</p>
    <div class="flex max-sm:flex-col max-sm:w-full items-start gap-24">
        <div class="w-full">
            <Input bind:value={email} type="email" placeholder="Email"/>
            {#if failed}
                <p class="mt-8">{errorMessage}</p>
            {/if}
        </div>
        <div class="flex items-center gap-8 w-full">
            <button 
                class="btn btn-light-green flex-1 w-fit" 
                onclick={subscribe}
            >
                {#if success}
                    Subscribed
                    <Check size='16'/>
                {:else}
                    Subscribe
                {/if}
                {#if loading}
                    <div class="spinner"></div>
                {/if}
            </button>
            <a href="/rss.xml" class="icon-btn btn-transparent">
                <Rss/>
            </a>
        </div>
    </div>
</div>


<style>
    footer{
        padding: 44px 64px;
        display: flex;
        gap: 32px;
        border-top: 1px solid var(--color-border-neutral);
        justify-content: space-between;
        
        @media (width < 40rem){
            padding: 20px;
            align-items: center;
            flex-direction: column;
        }
    }
    .spinner {
		border: 2px solid transparent;
		border-top: 2px solid white;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		animation: spin 0.5s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
    }
</style>
