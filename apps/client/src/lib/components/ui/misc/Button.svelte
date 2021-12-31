<script lang="ts">
    import { Loader5Line } from 'svelte-remixicon';

    export let loading = false;
    export let loadingText = 'Loading...';
    export let type = 'button';
    export let kind: 'primary' | 'normal' = 'normal';
    export let title = '';
</script>

<button {type} class:primary={kind === 'primary'} {title} on:click>
    {#if loading}
        <Loader5Line class="button-icon animate-spin" />
        <span class="button-text">{loadingText}</span>
    {:else}
        <slot />
    {/if}
</button>

<style lang="scss">
    button {
        @apply flex items-center px-2 py-1.5 transition transform focus:ring-0 m-0 text-base rounded-lg select-none;
        text-transform: lowercase;
        font-variant: small-caps;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--text-color);

        &.primary {
            @apply border border-white text-white;
            &:hover {
                background: var(--accent-light);
            }
        }

        &:hover {
            color: white;
            background: var(--accent);
            text-decoration: none;
            @apply scale-105;
        }

        &:active {
            @apply text-white scale-100 cursor-pointer shadow-inner;
            background: var(--accent-dark);
        }

        :global(svg.button-icon) {
            @apply mr-1.5 relative;
        }

        :global(svg.button-icon.no-text) {
            @apply mr-0;
        }

        :global(span.button-text) {
            @apply relative -top-0.5;
        }
    }
</style>
