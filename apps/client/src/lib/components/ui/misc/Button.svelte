<script lang='ts'>
  import { Loader5Line } from 'svelte-remixicon';
  export let loading = false;
  export let loadingText = 'Loading...';
  export let type = 'button';
</script>

<button {type} on:click>
  {#if loading}
    <Loader5Line class='button-icon animate-spin' />
    <span class='button-text'>{loadingText}</span>
  {:else}
    <slot />
  {/if}
</button>

<style lang='scss'>
  button {
    @apply flex items-center px-2 py-1.5 transition transform focus:ring-0 m-0 text-base rounded-md select-none;
    text-transform: lowercase;
    font-variant: small-caps;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--text-color);
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
      width: 1rem !important;
      &.no-text {
        @apply mr-0;
      }
      &.loading {
        svg {
          @apply animate-spin;
        }
      }
    }
    :global(span.button-text) {
      @apply relative -top-0.5;
    }
  }
</style>