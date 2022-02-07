<script lang="ts">
    import '../app.scss';
    import { QueryClientProvider, broadcastQueryClient } from '@sveltestack/svelte-query';
    import Nav from '$lib/components/nav/Nav.svelte';
    import { app } from '$lib/repo/app.repo';
    import { onMount } from 'svelte';
    import { queryClient } from '$lib/util';

    onMount(async () => {
        await broadcastQueryClient({
            queryClient,
            broadcastChannel: 'explore',
        });
    });
</script>

<QueryClientProvider client={queryClient}>
    <main
        class="flex h-screen {$app.theme}"
        class:dark={$app.darkMode === true}
        class:light={$app.darkMode === false}
    >
        <Nav />
        <slot />
    </main>
</QueryClientProvider>

<style lang="scss">
    :global(main) {
        color: var(--text-color);
        font-family: var(--body-text);
        background: var(--background);
    }
</style>
