<script lang="ts">
  import { page } from '$app/stores';
  import PageNav from '$lib/components/nav/PageNav.svelte';
  import {
    Compass3Line,
    SunLine,
    NewspaperLine,
    MistFill,
    CalendarLine,
    CalendarEventLine,
  } from 'svelte-remixicon';
</script>

<svelte:head>
  <title>Explore &mdash; Offprint</title>
</svelte:head>

<div class="flex w-full h-screen">
  <PageNav>
    <div slot="header">
      <h3>Explore</h3>
      <Compass3Line />
    </div>
    <div slot="pages">
      <form on:submit|preventDefault>
        <input type='text' placeholder='Search Offprint...' aria-placeholder='Search Offprint'>
      </form>
      <a href='/explore' class:active={$page.path === '/explore'}>
        <span class='link-icon'><MistFill /></span>
        <span class='text'>Overview</span>
      </a>
      <a href='/explore/popular-this-week' class:active={$page.path === '/explore/popular-this-week'}>
        <span class='link-icon'><CalendarLine /></span>
        <span class='text'>Popular this week</span>
      </a>
      <a href='/explore/popular-today' class:active={$page.path === '/explore/popular-today'}>
        <span class='link-icon'><CalendarEventLine /></span>
        <span class='text'>Popular today</span>
      </a>
      <a href='/explore/new-works' class:active={$page.path === '/explore/new-works'}>
        <span class='link-icon'><NewspaperLine /></span>
        <span class='text'>New works</span>
      </a>
      <a href='/explore/special-events' class:active={$page.path === '/explore/special-events'}>
        <span class='link-icon'><SunLine /></span>
        <span class='text'>Special events</span>
      </a>
    </div>
  </PageNav>
  <slot />
</div>