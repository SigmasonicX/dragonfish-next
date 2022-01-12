<script lang="ts">
    import '../app.scss';
    import Nav from '$lib/components/nav/Nav.svelte';
    import { app } from '$lib/repo/app.repo';
</script>

<main
    class="flex h-screen {$app.theme}"
    class:dark={$app.darkMode === true}
    class:light={$app.darkMode === false}
>
    <Nav />
    <slot />
</main>

<style lang="scss">
    :global(main) {
        color: var(--text-color);
        font-family: var(--body-text);
        background: var(--background);
    }
</style>
