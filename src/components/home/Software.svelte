<script lang="ts">
    type Tab = "Folio" | "Cascada";
    let activeTab: Tab = $state("Folio");

    const selectTab = (tab: Tab) => activeTab = tab;
</script>

<section>
    <h2>Software</h2>
    <div class="max-w-[600px] flex flex-col gap-44">
        <div class="tab-bar">
            <button data-selected={activeTab === "Folio"} class="tab-button text-h4" onclick={()=>selectTab("Folio")}>
                Folio
            </button>
            <button data-selected={activeTab === "Cascada"} class="tab-button text-h4" onclick={()=>selectTab("Cascada")}>
                Cascada
            </button>
        </div>
        <div class="w-full flex flex-col gap-12 items-center px-32">
            <ul class="flex items-center gap-20 text-text-brand-rest">
                {#if activeTab === "Folio"}
                    <li><a href="https://github.com/snubwoody/folio">Github repository</a></li>
                    <li><a href="https://folio.wakunguma.com">Website</a></li>
                {:else}
                    <li><a href="https://github.com/snubwoody/cascada">Github repository</a></li>
                    <li><a href="https://docs.rs/cascada/latest/cascada/">Website</a></li>
                {/if}
            </ul>
            <p class="w-full text-center">
                {#if activeTab === "Folio"}
                    Folio is a privacy-focused offline desktop application built for people who want full control over their data. It stores everything locally on your machine, with no accounts, analytics, or cloud services behind the scenes.
                {:else}
                    Cascada is a lightweight, high-performance UI layout engine.
                {/if}
            </p>
        </div>
        {#if activeTab === "Folio"}
            <img src="https://opengraph.githubassets.com/1/snubwoody/folio" alt="">
        {:else}
            <img src="https://opengraph.githubassets.com/1/snubwoody/cascada" alt="">
        {/if}
    </div>
</section>

<style>
    section{
        display: flex;
        flex-direction: column;
        gap: 44px;
        padding: 56px;
        align-items: center;
    }

    .main{
        display: flex;
        max-width: 600px;
    }

    .tab-bar{
        display: flex;
        align-items: center;
        width: 100%;
    }

    .tab-button{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 0px;
        width: 100%;
        border-bottom: 4px solid var(--color-neutral-50);
        transition: all 250ms;

        &[data-selected="true"] {
            border-color: var(--color-neutral-950);
        }
    }

    img{
        width: 100%;
    }
</style>


