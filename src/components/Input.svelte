<script lang="ts">
    import type { HTMLInputTypeAttribute } from "svelte/elements";

    type Props = {
        type?: HTMLInputTypeAttribute,
        placeholder?: string
    };

    let {placeholder,type = "text"}:Props = $props();
</script>

<input {type} {placeholder}>

<style>
    input{
        padding: 12px 16px;
        border-radius: var(--radius-md);

        &::placeholder{
            color: var(--color-text-neutral);
        }
      
        :global([data-theme="light"]) &{
            border: 1px solid var(--color-border-neutral);
        }

        :global([data-theme="dark"]) &{
            background: var(--color-surface-neutral-rest);
        }
    }
</style>
