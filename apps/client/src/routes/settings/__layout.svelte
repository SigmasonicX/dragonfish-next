<script lang='ts'>
  import { page } from '$app/stores';
  import PageNav from '$lib/components/nav/PageNav.svelte';
  import { Settings5Line, Apps2Line, ShieldUserLine, UserSettingsLine, GroupLine, NotificationBadgeLine } from 'svelte-remixicon';
  import { isLoggedIn$ } from '$lib/repo/session.repo';
</script>

<svelte:head>
  <title>Settings &mdash; Offprint</title>
</svelte:head>

<div class='flex w-full h-screen'>
  <PageNav>
    <div slot='header'>
      <h3>Settings</h3>
      <Settings5Line />
    </div>
    <div slot='pages'>
      <a href='/settings' class:active={$page.path === '/settings'}>
        <span class='link-icon'><Apps2Line /></span>
        <span class='text'>General</span>
      </a>
      {#if $isLoggedIn$}
        <a href='/settings/account' class:active={$page.path === '/settings/account'}>
          <span class='link-icon'><ShieldUserLine /></span>
          <span class='text'>Account</span>
        </a>
        <a href='/settings/profile' class:active={$page.path === '/settings/profile'}>
          <span class='link-icon'><UserSettingsLine /></span>
          <span class='text'>Profile</span>
        </a>
        <a href='/settings/social' class:active={$page.path === '/settings/social'}>
          <span class='link-icon'><GroupLine /></span>
          <span class='text'>Social</span>
        </a>
        <a href='/settings/notifications' class:active={$page.path === '/settings/notifications'}>
          <span class='link-icon'><NotificationBadgeLine /></span>
          <span class='text'>Notifications</span>
        </a>
      {/if}
    </div>
  </PageNav>
  <slot />
</div>