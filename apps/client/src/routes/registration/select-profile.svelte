<script lang="ts">
  import { delay, of } from "rxjs";
  import { Loader5Line } from "svelte-remixicon";
  import { allProfiles$, setActiveProfile } from "$lib/repo/session.repo";
  import { goto } from "$app/navigation";

  const showProfiles = of(true).pipe(delay(1500));

  function selectProfile(id: string): void {
    setActiveProfile(id);
    goto('/');
  }
</script>

<div class="h-full w-full flex flex-col items-center justify-center p-4 h-96">
  {#if $showProfiles}
    <h2 class="text-3xl font-medium">Select Profile</h2>
    <div class="my-4"></div>
    <div class="flex items-center">
      {#each $allProfiles$ as profile}
        <div class="profile-box" on:click={selectProfile(profile._id)}>
          <img src={profile.profile.avatar} alt="avatar" class="border border-gray-600 dark:border-white rounded-md mb-0.5" style="max-width: 4rem">
          <div class="flex-1 flex flex-col items-center justify-center">
            <span class="text-xs text-center">{profile.screenName}</span>
            <span class="text-xs italic text-center">@{profile.userTag}</span>
          </div>
        </div>
      {/each}
      {#if $allProfiles$.length < 3}
        <a class="profile-box" href="/registration/create-profile">
          <span class="text-4xl font-extralight">+</span>
          <span>Add</span>
          <span>Profile</span>
        </a>
      {/if}
    </div>
  {:else}
    <h2 class="text-3xl font-medium">Welcome!</h2>
    <div class="my-4"></div>
    <div class="flex items-center">
      <Loader5Line class="animate-spin mr-2" />
      <span>Loading profiles...</span>
    </div>
  {/if}
</div>

<style lang="scss">
  div.profile-box, a.profile-box {
    @apply block flex flex-col items-center justify-center p-2 h-36 w-28 rounded-md transition transform mx-2.5 border border-gray-600 dark:border-white;
    color: var(--text-color);
    &:hover {
      @apply text-white scale-105 cursor-pointer no-underline;
      background: var(--accent);
      box-shadow: var(--dropshadow);
    }

    &:active {
      @apply text-white scale-100 cursor-pointer shadow-inner;
      background: var(--accent-dark);
    }

    &.active {
      @apply text-white;
      background: var(--accent);
    }
  }
</style>