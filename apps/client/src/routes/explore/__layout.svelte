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
        Hashtag,
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
                <span class="text">Popular This Week</span>
            </a>
            <a
                href="/explore/popular-today"
                class:active={$page.url.pathname === '/explore/popular-today'}
            >
                <span class="link-icon"><CalendarEventLine /></span>
                <span class="text">Popular Today</span>
            </a>
            <a href="/explore/new-works" class:active={$page.url.pathname === '/explore/new-works'}>
                <span class="link-icon"><NewspaperLine /></span>
                <span class="text">New Works</span>
            </a>
            <a href="/explore/tags" class:active={$page.url.pathname === '/explore/tags'}>
                <span class="link-icon"><Hashtag /></span>
                <span class="text">Fandom Tags</span>
            </a>
            <a
                href="/explore/special-events"
                class:active={$page.url.pathname === '/explore/special-events'}
            >
                <span class="link-icon"><SunLine /></span>
                <span class="text">Special Events</span>
            </a>
            {#if $session.currProfile}
                <h5
                    class="flex items-center text-lg font-medium mb-1 mt-2"
                    style="color: var(--text-color);"
                >
                    <span class="relative top-1">Library</span>
                </h5>
                <a href="/explore/library" class:active={$page.url.pathname === '/explore/library'}>
                    <span class="link-icon"><BookOpenLine /></span>
                    <span class="text">Prose & Poetry</span>
                </a>
                <a
                    href="/explore/library/favorite-blogs"
                    class:active={$page.url.pathname === '/explore/library/favorite-blogs'}
                >
                    <span class="link-icon"><HeartLine /></span>
                    <span class="text">Blogs</span>
                </a>
                <a
                    href="/explore/library/read-it-later"
                    class:active={$page.url.pathname === '/explore/library/read-it-later'}
                >
                    <span class="link-icon"><ArrowRightCircleLine /></span>
                    <span class="text">Read It Later</span>
                </a>
                <a
                    href="/explore/library/finished-reading"
                    class:active={$page.url.pathname === '/explore/library/finished-reading'}
                >
                    <span class="link-icon"><BookmarkLine /></span>
                    <span class="text">Finished Reading</span>
                </a>
                <a
                    href="/explore/library/reading-history"
                    class:active={$page.url.pathname === '/explore/library/reading-history'}
                >
                    <span class="link-icon"><HistoryLine /></span>
                    <span class="text">Reading History</span>
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
                    <span class="text">Add Bookshelf</span>
                </a>
            {/if}
        </svete:fragment>
    </PageNav>
    <slot />
</div>
