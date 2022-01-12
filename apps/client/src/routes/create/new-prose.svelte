<script lang="ts">
    import { createForm } from 'felte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';
    import type { CreateProse } from '$lib/models/content/works/forms';
    import { Genres, WorkKind, WorkStatus } from '$lib/models/content/works';
    import { ContentKind, ContentRating } from '$lib/models/content';
    import { createOne } from '$lib/services/content.service';
    import { session } from '$lib/repo/session.repo';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CloseLine, Save2Line } from 'svelte-remixicon';
    import {
        MAX_TITLE_LENGTH,
        MIN_TITLE_LENGTH,
        MIN_GENRE,
        MAX_GENRES,
        MIN_SHORT_DESC_LENGTH,
        MAX_SHORT_DESC_LENGTH,
        MIN_LONG_DESC_LENGTH,
    } from '$lib/util';

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            const formInfo: CreateProse = {
                title: values.title,
                desc: values.shortDesc,
                body: values.longDesc,
                category: values.category.value,
                genres: values.genres.map((val) => {
                    return val.value;
                }),
                tags: [],
                rating: values.rating.value,
                status: values.status.value,
            };

            await createOne($session.currProfile._id, ContentKind.ProseContent, formInfo).then(
                (res) => {
                    console.log(res);
                },
            );
        },
        validate: (values) => {
            const errors = {
                title: '',
                category: '',
                genres: '',
                shortDesc: '',
                longDesc: '',
                rating: '',
                status: '',
            };

            if (
                values.title &&
                (values.title.length < MIN_TITLE_LENGTH || values.title.length > MAX_TITLE_LENGTH)
            ) {
                errors.title = `Titles must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`;
            }

            if (!values.category) {
                errors.category = 'You must select a category';
            }

            if (
                values.genres &&
                (values.genres.length < MIN_GENRE || values.genres.length > MAX_GENRES)
            ) {
                errors.genres = `You must select at least ${MIN_GENRE} but no more than ${MAX_GENRES}`;
            }

            if (
                values.shortDesc &&
                (values.shortDesc.length < MIN_SHORT_DESC_LENGTH ||
                    values.shortDesc.length > MAX_SHORT_DESC_LENGTH)
            ) {
                errors.shortDesc = `Short descriptions must be between ${MIN_SHORT_DESC_LENGTH} and ${MAX_SHORT_DESC_LENGTH} characters`;
            }

            if (values.longDesc && values.longDesc.length < MIN_LONG_DESC_LENGTH) {
                errors.longDesc = `Long descriptions must be more than ${MIN_LONG_DESC_LENGTH} long`;
            }

            if (!values.rating) {
                errors.rating = `You must select a rating`;
            }

            if (!values.status) {
                errors.status = `You must select a status`;
            }

            return errors;
        },
    });

    const categories = Object.entries(WorkKind).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const genres = Object.entries(Genres).map(([key, value]) => ({ value: key, label: value }));
    const ratings = Object.entries(ContentRating).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const statuses = Object.entries(WorkStatus).map(([key, value]) => ({
        value: key,
        label: value,
    }));
</script>

<svelte:head>
    <title>Create Prose &mdash; Offprint</title>
</svelte:head>

<div class="w-full overflow-y-auto">
    <div class="max-w-4xl w-11/12 md:w-7/12 mx-auto my-10 mb-6">
        <h1 class="text-center text-4xl font-medium">Create New Prose</h1>
        <form use:form>
            <TextField
                name="title"
                type="text"
                title="Title"
                placeholder="A Brand New World"
                errorMessage={$errors.title}
            />
            <div class="flex items-center my-4 flex-wrap md:flex-nowrap">
                <div class="md:w-1/2 w-full">
                    <SelectMenu
                        items={categories}
                        label="Category"
                        on:select={(e) => {
                            $data.category = e.detail;
                        }}
                    />
                </div>
                <div class="hidden md:block md:mx-2" />
                <div class="md:w-1/2 w-full">
                    <SelectMenu
                        items={genres}
                        label="Genre(s)"
                        isMulti={true}
                        on:select={(e) => {
                            $data.genres = e.detail;
                        }}
                    />
                </div>
            </div>
            <TextField
                name="shortDesc"
                type="text"
                title="Short Description"
                placeholder="One of the best things never told"
                errorMessage={$errors.shortDesc}
            />
            <div class="my-4" />
            <Editor label="Long Description" bind:value={$data.longDesc} />
            <div class="flex items-center mt-4 flex-wrap md:flex-nowrap">
                <div class="md:w-1/2 w-full">
                    <SelectMenu
                        items={ratings}
                        label="Rating"
                        on:select={(e) => {
                            $data.rating = e.detail;
                        }}
                    />
                </div>
                <div class="hidden md:block md:mx-2" />
                <div class="md:w-1/2 w-full">
                    <SelectMenu
                        items={statuses}
                        label="Status"
                        on:select={(e) => {
                            $data.status = e.detail;
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
