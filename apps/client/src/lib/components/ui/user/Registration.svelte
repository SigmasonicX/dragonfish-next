<script lang="ts">
  import { LoginCircleLine } from "svelte-remixicon";
  import LogInForm from "$lib/components/ui/user/LogInForm.svelte";
</script>

<div class="flex flex-col">
  <div class="header">
    <h3>Log In</h3>
    <LoginCircleLine />
  </div>
  <div class="p-4">
    <LogInForm />
  </div>
</div>

<style lang="scss">
  div.header {
    @apply px-4 py-6 border-b flex items-center;
    background: var(--accent);
    border-color: var(--accent-light);
    h3 {
      @apply font-medium text-3xl flex-1 text-white;
    }
    :global(svg) {
      @apply relative -top-0.5;
      color: white !important;
      width: 1.75rem !important;
      height: 1.75rem !important;
    }
  }
</style>