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
    import { profile$ } from '$lib/repo/profile.repo';
    import { Pronouns } from '$lib/models/accounts';
</script>

<div class="flex flex-col w-full h-screen overflow-y-auto">
    <div class="profile-header">
        <img
            class="block object-cover w-full h-[20rem]"
            src={$profile$.profile.coverPic}
            alt="cover"
        />
        <div class="user-info-container">
            <div class="user-info">
                <div class="avatar-container">
                    <img src={$profile$.profile.avatar} alt="avatar" />
                </div>
                <div>
                    <h1 class="text-4xl text-white font-medium">{$profile$.screenName}</h1>
                    <h3 class="text-xl text-white">@{$profile$.userTag}</h3>
                    <h5 class="text-white italic flex items-center">
                        {#if $profile$.profile.tagline !== 'null' && $profile$.profile.tagline !== null}
                            {$profile$.profile.tagline}
                            <span class="mx-2">|</span>
                        {/if}
                        {#each $profile$.profile.pronouns as pronoun}
                            {Pronouns[pronoun]}
                            <span class="mr-2" />
                        {/each}
                    </h5>
                    <div class="my-4" />
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    div.profile-header {
        @apply w-full flex flex-col;
        div.user-info-container {
            @apply w-full shadow-xl;
            background: var(--accent);

            div.user-info {
                @apply w-7/12 mx-auto flex relative -top-20 items-end;
                div.avatar-container {
                    @apply relative overflow-hidden bg-white max-w-[200px] rounded-full border-4 border-white mr-4;
                    img {
                        @apply object-cover w-full h-full w-48 h-48;
                    }
                }
            }
        }
    }
</style>
