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
</script>

<div class="flex flex-col w-full h-screen overflow-y-auto">
    <div class="profile-header">
        <img src={$profile$.profile.coverPic} alt="cover" />
    </div>
</div>

<style lang="scss">
    div.profile-header {
        @apply w-full;
    }
</style>
