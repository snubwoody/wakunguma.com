<script lang="ts">
    import Input from "../components/Input.svelte";
    import {Rss,Check} from '@lucide/svelte/icons';
    import { apiV1 } from "../lib";

    let loading = $state(false)
    let success = $state(false)
    let failed = $state(false)
    let email: null | string = $state(null)
    let errorMessage = $state("Something went wrong")

    const subscribe = async () => {
        try{
            loading = true
            let url = `${apiV1}/subscribe`
            const response = await fetch(url,{
                method:"POST",
                headers: {
                    "content-type":"application/json"
                },
                body: JSON.stringify({email})
            });

            if (response.ok){
                success = true   
                setTimeout(()=>{
                    success = false
                    email = ""
                },2500)         
                return;
            }
            let body = await response.json();
            errorMessage = body.details ?? "Something went wrong"
            failed = true;
            setTimeout(()=>{
                failed = false
            },2500)
        }catch(e){
            failed = true;
            setTimeout(()=>{
                failed = false
            },2500)
        } finally{
            loading = false;
        }
        
    }
</script>

<footer class="flex py-80 border-t border-border-neutral justify-center items-center">
    <div class="flex flex-col gap-24">
        <header class="flex flex-col gap-4">
            <h5>Subscribe</h5>
            <p>Get notified when a new post goes live</p>
        </header>
        <div class="flex max-sm:flex-col items-start gap-24">
            <div class="w-full">
                <Input bind:value={email} type="email" placeholder="email@example.com"/>
                {#if failed}
                    <p class="mt-8">{errorMessage}</p>
                {/if}
            </div>
            <div class="flex items-center gap-8 w-full">
                <button 
                    class="btn btn-primary flex-1" 
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
</footer>

<style>
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
