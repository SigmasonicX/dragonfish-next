<script lang="ts">
    import { page } from '$app/stores';
    import PageNav from '$lib/components/nav/PageNav.svelte';
    import { session } from '$lib/repo/session.repo';
    import {
        Compass3Line,
        SunLine,
        NewspaperLine,
        MistFill,
        CalendarLine,
        CalendarEventLine,
        BookOpenLine,
        HeartLine,
        ArrowRightCircleLine,
        BookmarkLine,
        HistoryLine,
        BarChart2Fill,
        AddBoxLine,
        Gift2Line,
    } from 'svelte-remixicon';
</script>

<svelte:head>
    <title>Explore &mdash; Offprint</title>
</svelte:head>

<div class="flex w-full h-screen">
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Explore</h3>
            <Compass3Line />
        </svelte:fragment>
        <svete:fragment slot="pages">
            <form on:submit|preventDefault>
                <input
                    type="text"
                    placeholder="Search Offprint..."
                    aria-placeholder="Search Offprint"
                    class="bg-zinc-400 dark:bg-zinc-600 placeholder-gray-600 dark:placeholder-zinc-400"
                />
            </form>
            <a href="/explore" class:active={$page.url.pathname === '/explore'}>
                <span class="link-icon"><MistFill /></span>
                <span class="text">Overview</span>
            </a>
            {#if $session.currProfile}
                <a
                    href="/explore/recommendations"
                    class:active={$page.url.pathname === '/explore/recommendations'}
                >
                    <span class="link-icon"><Gift2Line /></span>
                    <span class="text">Recommendations</span>
                </a>
            {/if}
            <a
                href="/explore/popular-this-week"
                class:active={$page.url.pathname === '/explore/popular-this-week'}
            >
                <span class="link-icon"><CalendarLine /></span>
                <span class="text">Popular this week</span>
            </a>
            <a
                href="/explore/popular-today"
                class:active={$page.url.pathname === '/explore/popular-today'}
            >
                <span class="link-icon"><CalendarEventLine /></span>
                <span class="text">Popular today</span>
            </a>
            <a href="/explore/new-works" class:active={$page.url.pathname === '/explore/new-works'}>
                <span class="link-icon"><NewspaperLine /></span>
                <span class="text">New works</span>
            </a>
            <a
                href="/explore/special-events"
                class:active={$page.url.pathname === '/explore/special-events'}
            >
                <span class="link-icon"><SunLine /></span>
                <span class="text">Special events</span>
            </a>
            {#if $session.currProfile}
                <h5
                    class="flex items-center text-lg font-medium mb-1 mt-2"
                    style="color: var(--text-color);"
                >
                    <span class="relative top-1">Library</span>
                </h5>
                <a href="/explore">
                    <span class="link-icon"><BookOpenLine /></span>
                    <span class="text">All works</span>
                </a>
                <a href="/explore">
                    <span class="link-icon"><HeartLine /></span>
                    <span class="text">Favorite blogs</span>
                </a>
                <a href="/explore">
                    <span class="link-icon"><ArrowRightCircleLine /></span>
                    <span class="text">Read it later</span>
                </a>
                <a href="/explore">
                    <span class="link-icon"><BookmarkLine /></span>
                    <span class="text">Finished reading</span>
                </a>
                <a href="/explore">
                    <span class="link-icon"><HistoryLine /></span>
                    <span class="text">Reading history</span>
                </a>
                <h5
                    class="flex items-center text-lg font-medium mb-1 mt-2"
                    style="color: var(--text-color);"
                >
                    <span class="relative top-1">Bookshelves</span>
                </h5>
                <a href="/explore">
                    <span class="link-icon"><BarChart2Fill /></span>
                    <span class="text">My new favorite things</span>
                </a>
                <a href="/explore">
                    <span class="link-icon"><AddBoxLine /></span>
                    <span class="text">Add bookshelf</span>
                </a>
            {/if}
        </svete:fragment>
    </PageNav>
    <slot />
</div>
