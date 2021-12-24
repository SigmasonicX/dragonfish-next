<script lang="ts">
  import { UserLine, BookOpenLine, CupLine, Group2Line, LogoutCircleLine } from "svelte-remixicon";
  import { currentProfile$ } from "$lib/repo/session.repo";
  import { abbreviate, pluralize } from "$lib/util";
</script>

<div class="flex flex-col w-full">
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
          <!--<dragonfish-role-badge [roles]="user.roles" [size]="'small'"></dragonfish-role-badge>-->
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
    <a class="settings-button">
      <span class="link-icon"><UserLine size="1.5rem" /></span>
      <span class="link-text">View Profile</span>
    </a>
    <a class="settings-button">
      <span class="link-icon"><BookOpenLine size="1.5rem" /></span>
      <span class="link-text">View Works</span>
    </a>
    <a class="settings-button">
      <span class="link-icon"><CupLine size="1.5rem" /></span>
      <span class="link-text">View Blogs</span>
    </a>
    <div class="my-4 border-b w-full border-gray-600 dark:border-white"></div>
    <a class="settings-button">
      <span class="link-icon"><Group2Line size="1.5rem" /></span>
      <span class="link-text">Switch Profile</span>
    </a>
    <a class="settings-button">
      <span class="link-icon"><LogoutCircleLine size="1.5rem" /></span>
      <span class="link-text">Log Out</span>
    </a>
  </div>
</div>

<style lang="scss">
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
  a.settings-button {
    @apply flex items-center p-4 my-1.5 border border-gray-600 dark:border-white rounded-md cursor-pointer transition transform;
    color: var(--text-color);
    &:hover {
      @apply text-white scale-105 no-underline;
      background: var(--accent);
    }
    span.link-icon {
      @apply mr-2;
    }
  }
</style>