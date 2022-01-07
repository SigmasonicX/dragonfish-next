<script lang="ts">
    import { createForm } from 'felte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';

    const { form, errors } = createForm({
        onSubmit: (values) => {
            console.log(values);
        },
    });
</script>

<svelte:head>
    <title>Create Prose &mdash; Offprint</title>
</svelte:head>

<div class="w-full overflow-y-auto">
    <div class="max-w-4xl w-11/12 md:w-7/12 mx-auto my-10 mb-6">
        <h1 class="text-center text-4xl font-medium">Create New Prose</h1>
        <form use:form>
            <TextField
                name="text"
                type="text"
                title="Title"
                placeholder="A Brand New World"
                errorMessage={$errors.title}
            />

            <Editor label="Long Description" />
        </form>
    </div>
</div>
