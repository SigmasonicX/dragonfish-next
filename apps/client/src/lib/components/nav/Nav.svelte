<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { LoginCircleLine, Home5Line, Compass3Line, GroupLine, Settings5Line, CloseLine, InboxLine } from 'svelte-remixicon';
  import Sidenav from '$lib/components/nav/Sidenav.svelte';
  import UserMenu from "$lib/components/ui/user/UserMenu.svelte";
  import { currentProfile$ } from "$lib/repo/session.repo";
  import InboxMenu from "$lib/components/ui/user/InboxMenu.svelte";

  enum MenuOptions {
    NoMenu,
    UserMenu,
    InboxMenu,
  }

  let currentMenu = MenuOptions.NoMenu;

  function toggleMenu(menuOption: MenuOptions) {
    if (currentMenu === MenuOptions.NoMenu) {
      currentMenu = menuOption;
    } else {
      currentMenu = MenuOptions.NoMenu;
    }
  }

  navigating.subscribe(val => {
    if (val !== null) {
      currentMenu = MenuOptions.NoMenu;
    }
  });
</script>

<div class="navbar">
  <div class="py-2 flex flex-col items-center h-full">
    {#if $currentProfile$}
      <div
        class="link select-none cursor-pointer group"
        on:click={toggleMenu(MenuOptions.UserMenu)}
        class:active={currentMenu === MenuOptions.UserMenu}
        class:no-padding={currentMenu !== MenuOptions.UserMenu}
      >
        {#if currentMenu === MenuOptions.UserMenu}
          <span class="link-icon"><CloseLine size="1.5rem" /></span>
          <span class="link-name">Close</span>
        {:else}
          <img src={$currentProfile$.profile.avatar} class="rounded-full group-hover:rounded-none" alt="avatar">
        {/if}
      </div>
      <div
        class="link select-none cursor-pointer"
        on:click={toggleMenu(MenuOptions.InboxMenu)}
        class:active={currentMenu === MenuOptions.InboxMenu}
      >
        {#if currentMenu === MenuOptions.InboxMenu}
          <span class="link-icon"><CloseLine size="1.5rem" /></span>
          <span class="link-name">Close</span>
        {:else}
          <span class="link-icon"><InboxLine size="1.5rem" /></span>
          <span class="link-name">Inbox</span>
        {/if}
      </div>
    {:else}
      <a class="link" href="/registration">
        <span class="link-icon"><LoginCircleLine size="1.5rem" /></span>
        <span class="link-name">Log In</span>
      </a>
    {/if}
    <div class="w-10/12 mx-auto border-b border-white my-2"></div>
    <a class="link" href='/' class:active={$page.path === '/' && currentMenu === MenuOptions.NoMenu}>
      <span class="link-icon"><Home5Line size="1.5rem" /></span>
      <span class="link-name">Home</span>
    </a>
    <a class="link" href='/explore' class:active={$page.path.startsWith('/explore') && currentMenu === MenuOptions.NoMenu}>
      <span class="link-icon"><Compass3Line size="1.5rem" /></span>
      <span class="link-name">Explore</span>
    </a>
    <a class="link" href='/social' class:active={$page.path.startsWith('/social') && currentMenu === MenuOptions.NoMenu}>
      <span class="link-icon"><GroupLine size="1.5rem" /></span>
      <span class="link-name">Social</span>
    </a>
    <div class="flex-1"></div>
    <div class="w-10/12 mx-auto border-b border-white my-2"></div>
    <a class="link" href='/settings' class:active={$page.path.startsWith('/settings') && currentMenu === MenuOptions.NoMenu}>
      <span class="link-icon"><Settings5Line size="1.5rem" /></span>
      <span class="link-name">Settings</span>
    </a>
  </div>
</div>

{#if currentMenu === MenuOptions.UserMenu}
  <Sidenav on:click={() => currentMenu = MenuOptions.NoMenu}>
    <UserMenu />
  </Sidenav>
{:else if currentMenu === MenuOptions.InboxMenu}
  <Sidenav on:click={() => currentMenu = MenuOptions.NoMenu}>
    <InboxMenu />
  </Sidenav>
{/if}

<style lang="scss">
  div.navbar {
    @apply h-screen w-[75px] z-50 relative;
    background: var(--accent);
    box-shadow: var(--dropshadow);
  }
  a.link, div.link {
    @apply p-2 mx-2 mb-1 border-2 border-transparent rounded-md transition transform text-white flex flex-col items-center justify-center w-[61px] h-[61px];
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
    &.no-padding {
      @apply p-0 w-auto overflow-hidden;
    }
    img {
      @apply block object-cover;
      width: 57px;
      height: 57px;
    }
  }
</style>