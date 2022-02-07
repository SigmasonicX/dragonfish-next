<script context="module" lang="ts">
    /*
     * Fetching profile prior to loading the page.
     * */
    import type { Load } from '@sveltejs/kit';
    import { profile } from '$lib/repo/profile.repo';
    import type { Profile } from '$lib/models/accounts';
    import { getProfile } from '$lib/services/profile.service';

    export const load: Load = async ({ params }) => {
        const profileId: string = params.id;
        const profileModel = await getProfile(profileId).then((res) => {
            return res.data;
        });

        profile.set(profileModel);

        return {
            props: {
                profileModel,
            },
        };
    };
</script>

<script lang="ts">
    import { page } from '$app/stores';
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
    // eslint-disable-next-line no-redeclare
    import type { Profile } from '$lib/models/accounts';

    export let profileModel: Profile;
</script>

<div class="flex flex-col w-full h-screen overflow-y-auto">
    <div class="profile-header">
        {#if profileModel.profile.coverPic}
            <img
                class="block object-cover w-full h-40 lg:h-[20rem]"
                src={profileModel.profile.coverPic}
                alt="cover"
            />
        {:else}
            <div class="w-full h-[8rem]" style="background: var(--accent);" />
        {/if}
        <div class="user-info-container">
            <div class="user-info">
                <div class="avatar-container self-end">
                    <img src={profileModel.profile.avatar} alt="avatar" />
                </div>
                <div class="flex-1 lg:self-end top-4 flex flex-col relative">
                    <h1 class="text-2xl lg:text-3xl text-white font-medium">
                        {profileModel.screenName}
                    </h1>
                    <h3 class="text-base text-white">@{profileModel.userTag}</h3>
                    <span class="text-xs mt-1">
                        <a class="text-white" href="/profile/{profileModel._id}/followers">
                            {profileModel.stats.followers} follower{pluralize(
                                profileModel.stats.followers,
                            )}
                        </a>
                        <span class="mx-1 text-white">•</span>
                        <a class="text-white" href="/profile/{profileModel._id}/following">
                            {profileModel.stats.following} following
                        </a>
                    </span>
                    <div class="my-5" />
                </div>
                <div class="flex items-center">
                    <Button kind="primary">
                        <UserFollowLine class="button-icon" />
                        <span class="button-text">Follow</span>
                    </Button>
                    <div class="mx-1" />
                    <Button kind="primary">
                        <MenuLine class="button-icon no-text" size="20px" />
                    </Button>
                </div>
            </div>
            <div class="user-nav">
                <a
                    href="/profile/{profileModel._id}"
                    class:active={$page.url.pathname === `/profile/${profileModel._id}`}
                >
                    <Home5Line size="20px" class="mr-1" />
                    <span>Home</span>
                </a>
                <a
                    href="/profile/{profileModel._id}/works"
                    class:active={$page.url.pathname.includes(`works`)}
                >
                    <QuillPenLine size="20px" class="mr-1" />
                    <span>{profileModel.stats.works} Work{pluralize(profileModel.stats.works)}</span
                    >
                </a>
                <a
                    href="/profile/{profileModel._id}/blogs"
                    class:active={$page.url.pathname.includes(`blogs`)}
                >
                    <CupLine size="20px" class="mr-1" />
                    <span>{profileModel.stats.blogs} Blog{pluralize(profileModel.stats.blogs)}</span
                    >
                </a>
                <a
                    href="/profile/{profileModel._id}/shelves"
                    class:active={$page.url.pathname.includes(`shelves`)}
                >
                    <BarChart2Fill size="20px" class="mr-1" />
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
                @apply lg:w-7/12 w-11/12 mx-auto flex items-center flex-row relative lg:h-[7.5rem] h-[5.5rem];

                div.avatar-container {
                    @apply relative overflow-hidden bg-white max-w-[200px] rounded-full border-4 border-white mr-4 shadow-xl;
                    img {
                        @apply object-cover w-full h-full w-24 h-24 lg:w-48 lg:h-48;
                    }
                }
            }

            div.user-nav {
                @apply w-7/12 mx-auto flex items-center justify-center mb-2 mt-2;
                a {
                    @apply text-white lg:text-base text-sm flex items-center py-2 px-4 rounded-lg transition transform mx-0.5;
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
