<div class='page-nav bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-700'>
  <div class='header'>
    <slot name='header'></slot>
  </div>
  <div class='pages'>
    <slot name='pages'></slot>
  </div>
</div>

<style lang="scss">
  div.page-nav {
    @apply flex flex-col h-full border-r;
    width: 16rem;
    min-width: 16rem;
  }
  div.header :global {
    @apply px-4 py-5 border-b;
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
  div.pages :global {
    @apply w-full h-full overflow-y-auto flex flex-col px-4 py-4;
    form {
      @apply w-full mb-4;
      input {
        @apply w-full rounded-md border-transparent bg-gray-300 placeholder-gray-400 text-sm px-1.5 py-2.5 focus:border-gray-400 focus:ring-0;
        color: var(--text-color);
      }
    }
    a {
      @apply w-full px-1.5 py-2 rounded-md text-sm mb-0.5 flex items-center cursor-pointer select-none transition transform;
      color: var(--text-color);
      &:hover, &.active {
        @apply transition-all;
        background: var(--accent);
        text-decoration: none;
        color: white;
      }
      &:hover {
        @apply scale-105;
      }
      span.text {
        @apply flex-1 truncate;
      }
      span.link-icon {
        @apply mr-2 relative;
        svg {
          width: 18px !important;
          height: 18px !important;
        }
      }
    }
  }
</style>