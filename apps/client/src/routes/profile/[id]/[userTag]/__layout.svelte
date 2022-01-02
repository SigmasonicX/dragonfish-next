<script context="module" lang="ts">
    /*
     * Fetching profile prior to loading the page.
     * */
    import type { Load } from '@sveltejs/kit';
    import { lastValueFrom } from 'rxjs';
    import { setProfile } from '$lib/repo/profile.repo';

    export const load: Load = async ({ page }) => {
        const profileId: string = page.params.id;
        return {
            props: {
                content: await lastValueFrom(setProfile(profileId)),
            },
        };
    };
</script>

<script lang="ts">
    import { page } from '$app/stores';
    import { profile$ } from '$lib/repo/profile.repo';
    import { pluralize, slugify } from '$lib/util';
    import {
        UserFollowLine,
        MenuLine,
        Home5Line,
        QuillPenLine,
        CupLine,
        BarChart2Fill,
    } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
</script>

<div class="flex flex-col w-full h-screen overflow-y-auto">
    <div class="profile-header">
        {#if $profile$.profile.coverPic}
            <img
                class="block object-cover w-full h-[20rem]"
                src={$profile$.profile.coverPic}
                alt="cover"
            />
        {:else}
            <div class="w-full h-[8rem]" style="background: var(--accent);" />
        {/if}
        <div class="user-info-container">
            <div class="user-info">
                <div class="avatar-container self-end">
                    <img src={$profile$.profile.avatar} alt="avatar" />
                </div>
                <div class="flex-1 self-end">
                    <h1 class="text-3xl text-white font-medium">{$profile$.screenName}</h1>
                    <h3 class="text-base text-white">@{$profile$.userTag}</h3>
                    <span class="text-xs">
                        <a
                            class="text-white"
                            href="/profile/{$profile$._id}/{slugify($profile$.userTag)}/followers"
                        >
                            {$profile$.stats.followers} follower{pluralize(
                                $profile$.stats.followers,
                            )}
                        </a>
                        <span class="mx-1">•</span>
                        <a
                            class="text-white"
                            href="/profile/{$profile$._id}/{slugify($profile$.userTag)}/following"
                        >
                            {$profile$.stats.following} following
                        </a>
                    </span>
                    <div class="my-5" />
                </div>
                <div div class="flex items-center">
                    <Button kind="primary">
                        <UserFollowLine class="button-icon" />
                        <span class="button-text">Follow</span>
                    </Button>
                    <div class="mx-1" />
                    <Button kind="primary">
                        <MenuLine class="button-icon no-text" size="1.5rem" />
                    </Button>
                </div>
            </div>
            <div class="user-nav">
                <a
                    href="/profile/{$profile$._id}/{slugify($profile$.userTag)}"
                    class:active={$page.path ===
                        `/profile/${$profile$._id}/${slugify($profile$.userTag)}`}
                >
                    <Home5Line size="1.25rem" class="mr-1" />
                    <span>Home</span>
                </a>
                <a
                    href="/profile/{$profile$._id}/{slugify($profile$.userTag)}/works"
                    class:active={$page.path.includes(`works`)}
                >
                    <QuillPenLine size="1.25rem" class="mr-1" />
                    <span>{$profile$.stats.works} Work{pluralize($profile$.stats.works)}</span>
                </a>
                <a
                    href="/profile/{$profile$._id}/{slugify($profile$.userTag)}/blogs"
                    class:active={$page.path.includes(`blogs`)}
                >
                    <CupLine size="1.25rem" class="mr-1" />
                    <span>{$profile$.stats.blogs} Blog{pluralize($profile$.stats.blogs)}</span>
                </a>
                <a
                    href="/profile/{$profile$._id}/{slugify($profile$.userTag)}/shelves"
                    class:active={$page.path.includes(`shelves`)}
                >
                    <BarChart2Fill size="1.25rem" class="mr-1" />
                    <span>Shelves</span>
                </a>
            </div>
        </div>
    </div>
    <slot />
</div>

<style lang="scss">
    div.profile-header {
        @apply w-full flex flex-col mb-6;
        div.user-info-container {
            @apply w-full shadow-xl;
            background: var(--accent);

            div.user-info {
                @apply w-7/12 mx-auto flex relative;
                height: 7.5rem;

                div.avatar-container {
                    @apply relative overflow-hidden bg-white max-w-[200px] rounded-full border-4 border-white mr-4 shadow-xl;
                    img {
                        @apply object-cover w-full h-full w-48 h-48;
                    }
                }
            }

            div.user-nav {
                @apply w-7/12 mx-auto flex items-center justify-center mb-2;
                a {
                    @apply text-white flex items-center py-2 px-4 rounded-lg transition transform mx-0.5;
                    &:hover {
                        @apply scale-105 no-underline;
                        background: var(--accent-light);
                    }

                    &:active {
                        @apply scale-100;
                    }

                    &.active {
                        background: var(--accent-light);
                    }
                }
            }
        }
    }
</style>
