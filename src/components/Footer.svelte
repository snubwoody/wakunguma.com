<script lang="ts">
    import Input from "../components/Input.svelte";
    import {Rss,Check} from '@lucide/svelte/icons';
    import { apiV1 } from "../lib";

    let loading = $state(false)
    let success = $state(false)

    const subscribe = async (email: string) => {
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
                return;
            }

        }catch(e){
            alert("Something went wrong");
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
        <div class="flex items-center gap-24">
            <Input type="email" placeholder="example@email.com"/>
            <div class="flex items-center gap-8">
                <button 
                    class="btn btn-primary" 
                    onclick={() => alert("hi")}
                >
                    Subscribe
                    {#if success}
                        <Check size='16'/>
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
