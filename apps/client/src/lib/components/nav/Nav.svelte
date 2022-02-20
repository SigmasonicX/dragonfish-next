<script lang="ts">
    import { page, navigating } from '$app/stores';
    import {
        LoginCircleLine,
        Home5Line,
        Compass3Line,
        TeamLine,
        Settings5Line,
        CloseLine,
        InboxLine,
        AddBoxLine,
        Dashboard2Line,
        SearchEyeLine,
    } from 'svelte-remixicon';
    import Sidenav from '$lib/components/nav/Sidenav.svelte';
    import UserMenu from '$lib/components/ui/user/UserMenu.svelte';
    import { session } from '$lib/repo/session.repo';
    import InboxMenu from '$lib/components/ui/user/InboxMenu.svelte';
    import ContentMenu from '../ui/user/ContentMenu.svelte';
    import { isAllowed } from '$lib/services/auth.service';
    import { Roles } from '$lib/models/accounts';
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchAllUnread } from '$lib/services/activity.service';
    import Badge from '$lib/components/ui/misc/Badge.svelte';
    import { abbreviate } from '$lib/util';

    enum MenuOptions {
        NoMenu,
        UserMenu,
        CreateMenu,
        InboxMenu,
    }

    let currentMenu = MenuOptions.NoMenu;

    function toggleMenu(menuOption: MenuOptions) {
        currentMenu = menuOption;
    }

    navigating.subscribe((val) => {
        if (val !== null) {
            currentMenu = MenuOptions.NoMenu;
        }
    });

    const activity = useQuery('unreadActivity', () => fetchAllUnread($session.currProfile._id), {
        enabled: !!$session.currProfile,
        cacheTime: 1000 * 60 * 0.25,
    });
</script>

<div class="navbar">
    <div class="py-2 flex flex-col items-center h-full">
        {#if $session.currProfile}
            {#if currentMenu === MenuOptions.UserMenu}
                <div
                    class="link select-none cursor-pointer group"
                    on:click={() => toggleMenu(MenuOptions.NoMenu)}
                    class:active={currentMenu === MenuOptions.UserMenu}
                    class:no-padding={currentMenu !== MenuOptions.UserMenu}
                >
                    <span class="link-icon"><CloseLine size="24px" /></span>
                    <span class="link-name">Close</span>
                </div>
            {:else}
                <div
                    class="link select-none cursor-pointer group"
                    on:click={() => toggleMenu(MenuOptions.UserMenu)}
                    class:active={currentMenu === MenuOptions.UserMenu}
                    class:no-padding={currentMenu !== MenuOptions.UserMenu}
                >
                    <img
                        src={$session.currProfile.profile.avatar}
                        class="rounded-full"
                        alt="avatar"
                    />
                </div>
            {/if}
            {#if currentMenu === MenuOptions.CreateMenu}
                <div
                    class="link select-none cursor-pointer group"
                    on:click={() => toggleMenu(MenuOptions.NoMenu)}
                    class:active={currentMenu === MenuOptions.CreateMenu}
                >
                    <span class="link-icon"><CloseLine size="24px" /></span>
                    <span class="link-name">Close</span>
                </div>
            {:else}
                <div
                    class="link select-none cursor-pointer group"
                    on:click={() => toggleMenu(MenuOptions.CreateMenu)}
                    class:active={currentMenu === MenuOptions.CreateMenu}
                >
                    <span class="link-icon"><AddBoxLine size="24px" /></span>
                    <span class="link-name">Create</span>
                </div>
            {/if}
            {#if currentMenu === MenuOptions.InboxMenu}
                <div
                    class="link select-none cursor-pointer"
                    on:click={() => toggleMenu(MenuOptions.NoMenu)}
                    class:active={currentMenu === MenuOptions.InboxMenu}
                >
                    <span class="link-icon"><CloseLine size="24px" /></span>
                    <span class="link-name">Close</span>
                </div>
            {:else}
                <div
                    class="link select-none cursor-pointer"
                    on:click={() => toggleMenu(MenuOptions.InboxMenu)}
                    class:active={currentMenu === MenuOptions.InboxMenu}
                >
                    {#if $activity.data && $activity.data.length > 0}
                        <Badge positioning="top-right">
                            {abbreviate($activity.data.length)}
                        </Badge>
                    {/if}
                    <span class="link-icon"><InboxLine size="24px" /></span>
                    <span class="link-name">Inbox</span>
                </div>
            {/if}
        {:else}
            <a class="link" href="/registration">
                <span class="link-icon"><LoginCircleLine size="24px" /></span>
                <span class="link-name">Log In</span>
            </a>
        {/if}
        <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
        <a
            class="link"
            href="/"
            class:active={$page.url.pathname === '/' && currentMenu === MenuOptions.NoMenu}
        >
            <span class="link-icon"><Home5Line size="24px" /></span>
            <span class="link-name">Home</span>
        </a>
        <a class="link" href="/search" class:active={$page.url.pathname.startsWith('/search')}>
            <span class="link-icon"><SearchEyeLine size="24px" /></span>
            <span class="link-name">Search</span>
        </a>
        <a
            class="link"
            href="/explore"
            class:active={$page.url.pathname.startsWith('/explore') &&
                currentMenu === MenuOptions.NoMenu}
        >
            <span class="link-icon"><Compass3Line size="24px" /></span>
            <span class="link-name">Explore</span>
        </a>
        <a
            class="link"
            href="/social"
            class:active={$page.url.pathname.startsWith('/social') &&
                currentMenu === MenuOptions.NoMenu}
        >
            <span class="link-icon"><TeamLine size="24px" /></span>
            <span class="link-name">Social</span>
        </a>
        {#if $session.account && isAllowed( $session.account.roles, [Roles.Moderator, Roles.WorkApprover, Roles.Admin], )}
            <a
                class="link"
                href="/dashboard"
                class:active={$page.url.pathname.startsWith('/dashboard') &&
                    currentMenu === MenuOptions.NoMenu}
            >
                <span class="link-icon"><Dashboard2Line size="24px" /></span>
                <span class="link-name">Dash</span>
            </a>
        {/if}
        <div class="flex-1"><!--fill space--></div>
        <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
        <a
            class="link"
            href="/settings"
            class:active={$page.url.pathname.startsWith('/settings') &&
                currentMenu === MenuOptions.NoMenu}
        >
            <span class="link-icon"><Settings5Line size="24px" /></span>
            <span class="link-name">Settings</span>
        </a>
    </div>
</div>

{#if currentMenu === MenuOptions.UserMenu}
    <Sidenav on:click={() => (currentMenu = MenuOptions.NoMenu)}>
        <UserMenu on:logout={() => (currentMenu = MenuOptions.NoMenu)} />
    </Sidenav>
{:else if currentMenu === MenuOptions.CreateMenu}
    <Sidenav on:click={() => (currentMenu = MenuOptions.NoMenu)}>
        <ContentMenu />
    </Sidenav>
{:else if currentMenu === MenuOptions.InboxMenu}
    <Sidenav on:click={() => (currentMenu = MenuOptions.NoMenu)}>
        <InboxMenu />
    </Sidenav>
{/if}

<style lang="scss">
    div.navbar {
        @apply h-screen w-[75px] z-50 relative;
        background: var(--accent);
        box-shadow: var(--dropshadow);
    }

    a.link,
    div.link {
        @apply p-2 mx-2 mb-1 border-2 border-transparent rounded-lg transition transform text-white flex flex-col items-center justify-center w-[61px] h-[61px] relative;
        &:hover {
            @apply no-underline scale-105;
            box-shadow: var(--dropshadow);
            background: var(--accent-light);
            color: white;
            border-color: white;
        }

        &:active {
            @apply scale-105;
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

    div.link {
        img {
            @apply block object-cover;
            width: 57px;
            height: 57px;
        }
    }
</style>
