<script lang="ts">
    import { createForm } from 'felte';
    import { session } from '$lib/repo/session.repo';
    import Editor from '$lib/components/forms/Editor.svelte';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CheckLine } from 'svelte-remixicon';

    const { form, data } = createForm({
        onSubmit: (values) => {
            console.log(values);
        },
    });
</script>

<form use:form>
    <div
        class="add-comment bg-zinc-300 dark:bg-zinc-700 border-b-2 border-zinc-300 dark:border-zinc-500 dark:highlight-shadowed"
    >
        <Avatar size="2.25rem" src={$session.currProfile.profile.avatar} />
        <div class="mx-1"><!--spacer--></div>
        <h3 class="text-xl font-medium">Add a comment</h3>
        <div class="flex-1"><!--spacer--></div>
        <Button type="button">
            <CheckLine class="button-icon" />
            <span class="button-text">Post</span>
        </Button>
    </div>
    <Editor hasHeader="true" />
</form>

<style lang="scss">
    div.add-comment {
        @apply rounded-t-lg flex items-center w-full p-2 select-none;
    }
</style>
