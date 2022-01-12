<script lang="ts">
    import { goto } from '$app/navigation';
    import { createForm } from 'felte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';
    import { ContentRating, ContentKind } from '$lib/models/content';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CloseLine, Save2Line } from 'svelte-remixicon';
    import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH, MIN_LONG_DESC_LENGTH, slugify } from '$lib/util';
    import type { BlogForm } from '$lib/models/content/works/forms';
    import { createOne } from '$lib/services/content.service';
    import { session } from '$lib/repo/session.repo';

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            const formInfo: BlogForm = {
                title: values.title,
                body: values.body,
                rating: values.rating.value,
            };

            await createOne($session.currProfile._id, ContentKind.BlogContent, formInfo).then(
                (res) => {
                    goto(`/blog/${res.data._id}/${slugify(res.data.title)}`);
                },
            );
        },
        validate: (values) => {
            const errors = {
                title: '',
                body: '',
                rating: '',
            };

            if (
                values.title &&
                (values.title.length < MIN_TITLE_LENGTH || values.title.length > MAX_TITLE_LENGTH)
            ) {
                errors.title = `Titles must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`;
            }

            if (values.body && values.body.length < MIN_LONG_DESC_LENGTH) {
                errors.body = `Long descriptions must be more than ${MIN_LONG_DESC_LENGTH} long`;
            }

            if (!values.rating) {
                errors.rating = `You must select a rating`;
            }

            return errors;
        },
    });

    const ratings = Object.entries(ContentRating).map(([key, value]) => ({
        value: key,
        label: value,
    }));
</script>

<svelte:head>
    <title>Create Blog &mdash; Offprint</title>
</svelte:head>

<div class="w-full overflow-y-auto">
    <div class="max-w-4xl w-11/12 md:w-7/12 mx-auto my-10 mb-6">
        <h1 class="text-center text-4xl font-medium">Create New Blog</h1>
        <form use:form>
            <TextField
                name="title"
                type="text"
                title="Title"
                placeholder="A Brand New World"
                errorMessage={$errors.title}
            />
            <div class="my-4" />
            <Editor label="Blog" bind:value={$data.body} />
            <div class="flex items-center mt-4">
                <div class="w-full">
                    <SelectMenu
                        items={ratings}
                        label="Rating"
                        on:select={(e) => {
                            $data.rating = e.detail;
                        }}
                    />
                </div>
            </div>
            <div class="flex items-center justify-center mt-6">
                <Button type="button">
                    <CloseLine class="button-icon" />
                    <span class="button-text">Cancel</span>
                </Button>
                <div class="mx-2" />
                <Button type="submit">
                    <Save2Line class="button-icon" />
                    <span class="button-text">Save</span>
                </Button>
            </div>
        </form>
    </div>
</div>
