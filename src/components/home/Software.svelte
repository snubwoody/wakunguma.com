<script lang="ts">

</script>

<section>
    <h2>Software</h2>
    <div class="max-w-[600px] flex flex-col gap-44">
        <div class="tab-bar">
            <button class="tab-button">
                <h4>Folio</h4>
            </button>
            <button class="tab-button">
                <h4>Cascada</h4>
            </button>
        </div>
        <div class="w-full flex flex-col gap-12 items-center px-32">
            <ul class="flex items-center gap-20 text-text-brand-rest">
                <li><a href="/">Github repository</a></li>
                <li><a href="/">Documentation</a></li>
            </ul>
            <p class="w-full text-center">
                Folio is a privacy-focused offline desktop application built for people who want full control over their data. It stores everything locally on your machine, with no accounts, analytics, or cloud services behind the scenes.
            </p>
        </div>
        <img src="https://opengraph.githubassets.com/1/snubwoody/cascada" alt="">
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
    }

    img{
        width: 100%;
    }
</style>


