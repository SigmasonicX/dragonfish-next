<script lang="ts">
  import '../app.scss';
  import Nav from '$lib/components/nav/Nav.svelte';
  import { theme$, darkMode$ } from "$lib/repo/app.repo";
</script>

<main class="flex h-screen {$theme$}" class:dark={$darkMode$ === true} class:light={$darkMode$ === false}>
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