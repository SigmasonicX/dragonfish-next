<script lang="ts">
    import { writable } from 'svelte/store';
    import { session } from '$lib/repo/session.repo';
    import type { Profile } from '$lib/models/accounts';
    import UserCard from '$lib/components/ui/user/UserCard.svelte';

    interface ProfileSettings {
        profiles: Profile[];
        currProfile: Profile;
    }
    const profileSettings = writable<ProfileSettings>({
        profiles: $session.profiles,
        currProfile: null,
    });
</script>

<div class="w-full bg-zinc-200 dark:bg-zinc-600 py-10">
    <div class="w-11/12 mx-auto max-w-4xl flex items-end justify-center">
        {#each $profileSettings.profiles as profile}
            <div class="mx-2">
                <UserCard user={profile} showOptions={false} />
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
</style>
