<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    type Props = {} & HTMLInputAttributes;

    let {
        value = $bindable(),
        placeholder,
        type = "text"
    }:Props = $props();
</script>

<input {type} bind:value={value} {placeholder}>

<style>
    input{
        width: 100%;
        padding: 12px 16px;
        border-radius: var(--radius-md);

        &::placeholder{
            color: var(--color-text-muted);
        }
      
        :global([data-theme="light"]) &{
            border: 1px solid var(--color-border-neutral);
        }

        :global([data-theme="dark"]) &{
            background: var(--color-surface-neutral-rest);
        }
    }
</style>
