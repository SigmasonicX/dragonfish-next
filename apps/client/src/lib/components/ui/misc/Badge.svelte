<script lang='ts'>
  export let hasValue = true;
</script>

<div class='badge'>
  {#if hasValue}
    <slot />
  {/if}
</div>

<style lang='scss'>
  div.badge {
    @apply rounded-full p-1 border text-xs text-white;
    background: var(--accent);
  }
</style>