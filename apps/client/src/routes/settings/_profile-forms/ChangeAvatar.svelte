<script lang="ts">
    import { ImageEditLine } from 'svelte-remixicon';
    import type { Profile } from '$lib/models/accounts';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';

    export let user: Profile = null;
</script>

<div class="settings-box bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
    <h3 class="text-xl font-medium text-center">Avatar</h3>
    <span class="text-center text-sm italic w-full block">Upload a new avatar</span>
    <div class="self-center flex-1 my-4">
        <Avatar size="8rem" src={user.profile.avatar} />
    </div>
    <div class="self-center">
        <Button>
            <ImageEditLine class="button-icon" />
            <span class="button-text">Change</span>
        </Button>
    </div>
</div>

<style lang="scss">
    div.settings-box {
        @apply p-2 rounded-lg shadow-xl m-4 flex flex-col;
    }
</style>
