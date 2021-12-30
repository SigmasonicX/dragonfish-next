<script lang="ts">
  import { CloseLine } from "svelte-remixicon";
  import { theme$, darkMode$ } from "$lib/repo/app.repo";
</script>

<main class="h-screen w-full flex flex-col items-center justify-center {$theme$}" class:dark={$darkMode$ === true} class:light={$darkMode$ === false}>
  <a class="close-button" href="/" aria-label="Close registration page"><CloseLine size="2rem" /></a>
  <div class="content-box">
    <slot />
  </div>
</main>

<style lang="scss">
  :global(main) {
    color: var(--text-color);
    font-family: var(--body-text);
    background: var(--background);
  }
  div.content-box {
    @apply border border-gray-600 dark:border-white rounded-md overflow-hidden w-11/12 md:w-6/12 mx-auto transition transform;
    max-height: 100vh;
    box-shadow: var(--dropshadow);
  }
  a.close-button {
    @apply absolute top-4 right-4 border-2 rounded-full border-gray-600 dark:border-white;
    color: var(--text-color);
    &:hover {
      @apply no-underline text-white;
      background: var(--accent);
    }
  }
</style>