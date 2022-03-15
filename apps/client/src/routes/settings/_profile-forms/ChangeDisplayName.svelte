<script lang="ts">
    import { Save2Line } from 'svelte-remixicon';
    import type { Profile } from '$lib/models/accounts';
    import Button from '$lib/components/ui/misc/Button.svelte';

    export let user: Profile = null;
</script>

<div class="settings-box bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
    <h3 class="text-xl font-medium text-center">Change Display Name</h3>
    <span class="text-center text-sm italic w-full block"
        >Display Names are what everyone sees on works and blogs</span
    >
    <div class="self-center flex-1 my-4">form goes here</div>
    <div class="self-center">
        <Button>
            <Save2Line class="button-icon" />
            <span class="button-text">Update</span>
        </Button>
    </div>
</div>

<style lang="scss">
    div.settings-box {
        @apply p-2 rounded-lg shadow-xl m-4 flex flex-col;
    }
</style>
