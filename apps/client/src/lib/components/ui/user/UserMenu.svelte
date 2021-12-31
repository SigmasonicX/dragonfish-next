<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import {
        UserLine,
        BookOpenLine,
        CupLine,
        LogoutCircleRLine,
        ArrowLeftRightLine,
        ArrowLeftSLine,
        CheckLine,
        CloseLine,
        QuillPenLine,
    } from 'svelte-remixicon';
    import { currentProfile$, logout } from '$lib/repo/session.repo';
    import { abbreviate, pluralize, slugify } from '$lib/util';
    import RoleBadge from './RoleBadge.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';

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

<div class="w-full h-screen">
    <div class="topbar">
        {#if currPage === MenuPages.Main}
            <Button
                kind="primary"
                title="Switch Profile"
                on:click={() => (currPage = MenuPages.SwitchProfile)}
            >
                <ArrowLeftRightLine class="button-icon no-text" size="1.325rem" />
            </Button>
            <div class="flex-1" />
            <Button kind="primary" title="Log Out" on:click={() => (currPage = MenuPages.LogOut)}>
                <LogoutCircleRLine class="button-icon no-text" size="1.325rem" />
            </Button>
        {:else}
            <Button kind="primary" title="Go Back" on:click={() => (currPage = MenuPages.Main)}>
                <ArrowLeftSLine class="button-icon no-text" size="1.325rem" />
            </Button>
        {/if}
    </div>
    <div class="flex flex-col w-full h-full relative overflow-y-auto">
        {#if currPage === MenuPages.Main}
            <div class="cover-pic" class:has-accent={!$currentProfile$.profile.coverPic}>
                {#if $currentProfile$.profile.coverPic}
                    <img src={$currentProfile$.profile.coverPic} alt="cover pic" />
                {/if}
            </div>
            <div class="user-avatar" style="background: var(--background)">
                <img src={$currentProfile$.profile.avatar} alt="avatar" />
            </div>
            <div class="relative top-[5.5rem] w-full">
                <div class="text-center">
                    <h3 class="text-3xl font-medium">
                        <RoleBadge roles={$currentProfile$.roles} />
                        <a
                            href={`/profile/${$currentProfile$._id}/${slugify(
                                $currentProfile$.userTag,
                            )}`}>{$currentProfile$.screenName}</a
                        >
                    </h3>
                    <h4 class="text-xl">@{$currentProfile$.userTag}</h4>
                </div>
                <div class="flex items-center justify-center font-serif mt-4 max-w-[344px] mx-auto">
                    <a
                        href={`/profile/${$currentProfile$._id}/${slugify(
                            $currentProfile$.userTag,
                        )}/works`}
                        class="block flex flex-col items-center w-[86px] border-r border-zinc-300 dark:border-white text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300 rounded-l-lg"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($currentProfile$.stats.works)}</span>
                        <span>work{pluralize($currentProfile$.stats.works)}</span>
                    </a>
                    <a
                        href={`/profile/${$currentProfile$._id}/${slugify(
                            $currentProfile$.userTag,
                        )}/blogs`}
                        class="block flex flex-col items-center w-[86px] border-r border-zinc-300 dark:border-white text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($currentProfile$.stats.blogs)}</span>
                        <span>blog{pluralize($currentProfile$.stats.blogs)}</span>
                    </a>
                    <a
                        href={`/profile/${$currentProfile$._id}/${slugify(
                            $currentProfile$.userTag,
                        )}/followers`}
                        class="block flex flex-col items-center w-[86px] border-r border-zinc-300 dark:border-white text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($currentProfile$.stats.followers)}</span>
                        <span>follower{pluralize($currentProfile$.stats.followers)}</span>
                    </a>
                    <a
                        href={`/profile/${$currentProfile$._id}/${slugify(
                            $currentProfile$.userTag,
                        )}/following`}
                        class="block flex flex-col items-center w-[86px] text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300 rounded-r-lg"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($currentProfile$.stats.following)}</span>
                        <span>following</span>
                    </a>
                </div>
                <div
                    class="flex items-center justify-center my-4 w-11/12 mx-auto border-t border-zinc-300 dark:border-white pt-4"
                >
                    <a
                        href="/"
                        class="new-content-button border-zinc-600 dark:border-white group"
                        style="color: var(--text-color);"
                    >
                        <QuillPenLine size="1.25rem" class="mr-2 group-hover:text-white" />
                        <span>New Work</span>
                    </a>
                    <div class="mx-1" />
                    <a
                        href="/"
                        class="new-content-button border-zinc-600 dark:border-white group"
                        style="color: var(--text-color);"
                    >
                        <CupLine size="1.25rem" class="mr-2 group-hover:text-white" />
                        <span>New Blog</span>
                    </a>
                </div>
            </div>
        {:else if currPage === MenuPages.SwitchProfile}
            <div class="mt-16">
                <div class="empty">
                    <h3 class="text-2xl">Pardon our dust—</h3>
                    <p class="text-sm">This feature is not yet available.</p>
                </div>
            </div>
        {:else if currPage === MenuPages.LogOut}
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
                    <div class="mx-2" />
                    <Button on:click={() => (currPage = MenuPages.Main)}>
                        <CloseLine class="button-icon" />
                        <span class="button-text">No</span>
                    </Button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    div.topbar {
        @apply w-full p-4 flex items-center drop-shadow-xl relative z-40;
        background: var(--accent);

        button {
            @apply rounded-full p-1 border border-white transition transform text-white;
            &:hover {
                @apply scale-105;
            }

            &:active {
                @apply scale-100;
            }
        }
    }

    div.cover-pic {
        @apply w-full h-36;
        &.has-accent {
            @apply h-24;
            background: var(--accent);
        }
    }

    div.user-avatar {
        @apply absolute rounded-full border-4 overflow-hidden top-12 mx-auto max-w-[8.5rem] left-0 right-0;
        border-color: var(--background);

        img {
            @apply object-cover w-full h-full w-32 h-32;
        }
    }

    a.new-content-button {
        @apply block flex items-center flex-1 justify-center w-1/2 py-2 border rounded-lg transition transform no-underline;
        &:hover {
            @apply scale-105;
            span,
            svg {
                @apply text-white;
            }

            background: var(--accent);
        }

        &:active {
            @apply scale-100 text-white;
        }

        span {
            @apply uppercase text-xs font-bold tracking-widest;
        }
    }
</style>
