<script lang="ts">
  // TODO: adjust styles for site
  
  import Select from "svelte-select";

  export let items;
  export let value;
  export let placeholder = 'Select items...';
  export let isClearable = false;
</script>

<Select {items} {value} {placeholder} {isClearable} containerClasses="offprint-select" on:select />

<style lang="scss">
  .offprint-select {
    @apply bg-zinc-300 dark:bg-zinc-700 rounded-lg;
    color: var(--text-color) !important;
    :global(div.selectContainer) {
      @apply bg-zinc-300 dark:bg-zinc-700 rounded-lg;
      color: var(--text-color) !important;
      --borderRadius: 0.5rem;
    }
    :global(div.listContainer) {
      background: var(--background) !important;
      border-radius: 0.6rem !important;
    }
  }
</style>