<script lang="ts">
  import '../app.scss';
  import Nav from '$lib/components/nav/Nav.svelte';
</script>

<main class="flex h-screen crimson">
  <Nav />
  <slot />
</main>