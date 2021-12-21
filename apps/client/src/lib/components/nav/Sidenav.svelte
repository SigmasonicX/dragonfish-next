<script lang="ts">
  import { fly, fade } from "svelte/transition";
</script>

<div class="absolute z-40 top-0 left-[4.7rem] h-screen w-full flex">
  <div class="absolute z-30 bg-neutral-900 w-full h-screen opacity-75 backdrop-blur-md" transition:fade|local="{{ delay: 0, duration: 100 }}" on:click></div>
  <div class="menu" transition:fly|local="{{ delay: 0, duration: 200, x: -200 }}">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="body">
      <slot name="body"></slot>
    </div>
  </div>
</div>

<style lang="scss">
  div.menu {
    @apply flex flex-col h-screen z-40;
    min-width: 24rem;
    background: var(--background);
  }
  div.header :global {
    @apply px-4 py-6 border-b;
    background: var(--accent);
    border-color: var(--accent-light);
    & > div {
      @apply flex items-center;
      h3 {
        @apply font-medium text-3xl flex-1 text-white;
      }
      svg {
        @apply relative -top-0.5;
        color: white !important;
        width: 1.75rem !important;
        height: 1.75rem !important;
      }
    }
  }
  div.body :global {

  }
</style>