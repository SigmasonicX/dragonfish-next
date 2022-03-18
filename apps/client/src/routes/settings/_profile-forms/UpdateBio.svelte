<script lang="ts">
    import { createForm } from 'felte';
    import { Save2Line } from 'svelte-remixicon';
    import { profileSettings } from './form-state';
    import Button from '$lib/components/ui/misc/Button.svelte';

    const { form, createSubmitHandler } = createForm({
        onSubmit: () => {
            console.log('Default handler hit!');
        },
    });

    const submit = createSubmitHandler({
        onSubmit: (values) => {
            console.log(values);
        },
    });
</script>

<div class="settings-box bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
    <h3 class="text-xl font-medium text-center">Update Bio</h3>
    <span class="text-center text-sm italic w-full block"
        >Your bio is displayed in the About Me section of your profile</span
    >
    <form class="flex-1 my-4" use:form>
        <textarea
            class="rounded-lg w-full bg-zinc-400 dark:bg-zinc-500 ring-0 placeholder-zinc-300 dark:placeholder-zinc-400 px-1.5 py-2.5 border-0"
            name="bio"
            value={$profileSettings.currProfile.profile.bio}
            placeholder="Something awesome about me is..."
        />
    </form>
    <div class="self-center">
        <Button on:click={submit}>
            <Save2Line class="button-icon" />
            <span class="button-text">Save</span>
        </Button>
    </div>
</div>

<style lang="scss">
    div.settings-box {
        @apply p-2 rounded-lg shadow-xl m-4 flex flex-col;
    }
</style>
