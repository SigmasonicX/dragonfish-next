<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { UserLine, BookOpenLine, CupLine, LogoutCircleLine, ArrowLeftRightLine, ArrowLeftSLine, CheckLine, CloseLine } from "svelte-remixicon";
  import { currentProfile$, logout } from "$lib/repo/session.repo";
  import { abbreviate, pluralize } from "$lib/util";
  import RoleBadge from './RoleBadge.svelte';
  import Button from "$lib/components/ui/misc/Button.svelte";

  enum MenuPages {
    Main,
    SwitchProfile,
    LogOut,
  }

  let currPage = MenuPages.Main;
  const dispatch = createEventDispatcher();

  function logOut() {
    logout().subscribe(() => {
      dispatch('logout');
    });
  }
</script>

{#if currPage === MenuPages.Main}
  <div class="flex flex-col w-full" transition:fly|local="{{ delay: 0, duration: 200, x: -200 }}">
    <div class="top-buttons">
      <div class="flex-1"></div>
      <button class="top-button" title="Switch Profile" on:click={() => currPage = MenuPages.SwitchProfile}>
        <ArrowLeftRightLine size="1.325rem" />
      </button>
      <div class="mx-1"></div>
      <button class="top-button" title="Log Out" on:click={() => currPage = MenuPages.LogOut}>
        <LogoutCircleLine size="1.325rem" />
      </button>
    </div>
    <div class="cover-pic absolute z-10 w-full h-36 left-0 pointer-events-none" class:has-accent={!($currentProfile$.profile.coverPic)}>
      {#if $currentProfile$.profile.coverPic}
        <img
          class="object-cover object-center w-full h-full"
          src={$currentProfile$.profile.coverPic}
          alt="avatar"
        />
      {/if}
    </div>
    <div class="header">
      <div class="flex flex-row items-center">
        <div class="user-avatar">
          <img src={$currentProfile$.profile.avatar} alt="avatar" />
        </div>
        <div class="ml-2">
          <div class="flex items-center">
            <RoleBadge roles={$currentProfile$.roles} />
            <h2 class="text-2xl font-medium relative top-0.5">
              {$currentProfile$.screenName}
            </h2>
          </div>
          <h3 class="text-sm font-medium">
            @{$currentProfile$.userTag}
          </h3>
          <div class="flex items-center text-xs">
            <span>{abbreviate($currentProfile$.stats.followers)} follower{pluralize($currentProfile$.stats.followers)}</span>
            <span class="mx-1">|</span>
            <span>{abbreviate($currentProfile$.stats.following)} following</span>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4">
      <a class="settings-button border-zinc-600 dark:border-white" href="/">
        <span class="link-icon"><UserLine size="1.5rem" /></span>
        <span class="link-text">View Profile</span>
      </a>
      <a class="settings-button border-zinc-600 dark:border-white" href="/">
        <span class="link-icon"><BookOpenLine size="1.5rem" /></span>
        <span class="link-text">View Works</span>
      </a>
      <a class="settings-button border-zinc-600 dark:border-white" href="/">
        <span class="link-icon"><CupLine size="1.5rem" /></span>
        <span class="link-text">View Blogs</span>
      </a>
    </div>
  </div>
{:else if currPage === MenuPages.SwitchProfile}
  <div class="flex flex-col w-full" in:fade="{{ delay: 185, duration: 50 }}">
    <div class="top-buttons">
      <button class="top-button" title="Back" on:click={() => currPage = MenuPages.Main}>
        <ArrowLeftSLine size="1.325rem" />
      </button>
    </div>
    <div class="mt-16">
      <div class="empty">
        <h3 class="text-2xl">Pardon our dust—</h3>
        <p class="text-sm">This feature is not yet available.</p>
      </div>
    </div>
  </div>
{:else if currPage === MenuPages.LogOut}
  <div class="flex flex-col w-full" in:fade="{{ delay: 185, duration: 50 }}">
    <div class="top-buttons">
      <button class="top-button" title="Back" on:click={() => currPage = MenuPages.Main}>
        <ArrowLeftSLine size="1.325rem" />
      </button>
    </div>
    <div class="mt-16">
      <div class="empty">
        <h3 class="text-2xl">Going so soon?</h3>
        <p class="text-sm">Are you sure you want to log out?</p>
      </div>
      <div class="flex items-center w-full justify-center mt-8">
        <Button on:click={() => logOut()}>
          <CheckLine class="button-icon" />
          <span class="button-text">Yes</span>
        </Button>
        <div class="mx-2"></div>
        <Button on:click={() => currPage = MenuPages.Main}>
          <CloseLine class="button-icon" />
          <span class="button-text">No</span>
        </Button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  div.top-buttons {
    @apply absolute z-20 w-11/12 mx-4 top-4 flex items-center;
    button {
      @apply rounded-full p-1 border border-white transition transform;
      &:hover {
        @apply scale-105;
        background: var(--accent);
      }
      &:active {
        @apply scale-100;
      }
    }
  }
  div.cover-pic {
    mask-image: linear-gradient(to bottom, #000, #000 calc(100% - 305px), rgba(0,0,0,0) calc(100% - 5px), rgba(0,0,0,0));
    &.has-accent {
      background: var(--accent);
    }
  }
  div.header {
    @apply w-full relative z-20 mt-16 px-4;
    div.user-avatar {
      align-self: center;
      img {
        width: 75px;
        height: 75px;
        border-radius: 0.375rem;
        border: 1px solid var(--borders);
        box-shadow: var(--dropshadow);
      }
    }
    h2, h3 {
      color: var(--text-color);
    }
  }
  a.settings-button, div.settings-button {
    @apply block flex items-center p-4 my-1.5 border rounded-md cursor-pointer transition transform;
    color: var(--text-color);
    &:hover {
      @apply text-white scale-105 no-underline;
      background: var(--accent);
    }
    &:active {
      @apply text-white scale-100 no-underline;
      background: var(--accent);
    }
    span.link-icon {
      @apply mr-2;
    }
  }
</style>