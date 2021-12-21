<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { LoginCircleLine, Home5Line, Compass3Line, GroupLine, Settings5Line, CloseLine } from 'svelte-remixicon';
  import Sidenav from '$lib/components/nav/Sidenav.svelte';
  import Registration from "$lib/components/ui/user/Registration.svelte";

  let openLogin = false;

  navigating.subscribe(val => {
    if (val !== null) {
      openLogin = false;
    }
  });
</script>

<div class="navbar">
  <div class="py-2 flex flex-col items-center h-full">
    <a class="link select-none cursor-pointer" on:click={() => openLogin = !openLogin} class:active={openLogin}>
      {#if openLogin}
        <span class="link-icon"><CloseLine size="1.5rem" /></span>
        <span class="link-name">Close</span>
      {:else}
        <span class="link-icon"><LoginCircleLine size="1.5rem" /></span>
        <span class="link-name">Login</span>
      {/if}
    </a>
    <div class="w-10/12 mx-auto border-b border-white my-2"></div>
    <a class="link" href='/' class:active={$page.path === '/' && !openLogin}>
      <span class="link-icon"><Home5Line size="1.5rem" /></span>
      <span class="link-name">Home</span>
    </a>
    <a class="link" href='/explore' class:active={$page.path.startsWith('/explore') && !openLogin}>
      <span class="link-icon"><Compass3Line size="1.5rem" /></span>
      <span class="link-name">Explore</span>
    </a>
    <a class="link" href='/social' class:active={$page.path.startsWith('/social') && !openLogin}>
      <span class="link-icon"><GroupLine size="1.5rem" /></span>
      <span class="link-name">Social</span>
    </a>
    <div class="flex-1"></div>
    <a class="link" href='/settings' class:active={$page.path.startsWith('/settings') && !openLogin}>
      <span class="link-icon"><Settings5Line size="1.5rem" /></span>
      <span class="link-name">Settings</span>
    </a>
  </div>
</div>

{#if openLogin}
  <Sidenav on:click={() => openLogin = !openLogin}>
    <div slot="header">
      <h3>Log In</h3>
      <LoginCircleLine />
    </div>
    <div slot="body">
      <Registration />
    </div>
  </Sidenav>
{/if}

<style lang="scss">
  div.navbar {
    @apply h-screen w-[75px] z-50 relative;
    background: var(--accent);
    box-shadow: var(--dropshadow);
  }
  a.link {
    @apply p-2 mx-2 mb-1 border-2 border-transparent rounded-md transition transform text-white flex flex-col items-center justify-center w-[61px];
    &:hover {
      @apply no-underline scale-110;
      box-shadow: var(--dropshadow);
      background: var(--accent-light);
      color: white;
      border-color: white;
    }
    &.active {
      @apply no-underline shadow-xl;
      background: var(--accent-light);
      color: white;
      border-color: white;
    }
    span.link-name {
      @apply text-[0.6rem] uppercase font-bold tracking-wider;
    }
  }
</style>