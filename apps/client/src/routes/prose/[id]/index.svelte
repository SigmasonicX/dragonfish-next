<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { createForm } from 'felte';
    import { session } from '$lib/repo/session.repo';
    import {
        slugify,
        MIN_TITLE_LENGTH,
        MAX_TITLE_LENGTH,
        MIN_GENRE,
        MAX_GENRES,
        MIN_SHORT_DESC_LENGTH,
        MAX_SHORT_DESC_LENGTH,
        MIN_LONG_DESC_LENGTH,
    } from '$lib/util';
    import { content, updateContent } from '$lib/repo/content.repo';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import WorkBanner from '$lib/components/ui/content/WorkBanner.svelte';
    import { ArrowDownSLine, ArrowUpSLine } from 'svelte-remixicon';
    import SectionList from '$lib/components/ui/content/SectionList.svelte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';
    import { Genres, Prose, WorkKind, WorkStatus } from '$lib/models/content/works';
    import { ContentKind, ContentRating } from '$lib/models/content';
    import type { CreateProse } from '$lib/models/content/works/forms';
    import { saveChanges } from '$lib/services/content.service';
    import Comments from '$lib/components/comments/Comments.svelte';
    import ApprovalOptions from '$lib/components/ui/content/ApprovalOptions.svelte';
    import WorkStats from '$lib/components/ui/content/WorkStats.svelte';

    let showDesc = true;
    let editMode = false;

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

    function mapGenres(theseGenres: Genres[]) {
        const genresList = [];
        for (let i = 0; i < theseGenres.length; i++) {
            const thisGenre = genres.find((item) => {
                const genre = Genres[theseGenres[i]];
                return item.label === genre;
            });
            genresList.push(thisGenre);
        }
        return genresList;
    }

    const { form, data, createSubmitHandler, errors } = createForm({
        onSubmit: () => {
            console.log(`Primary submit handler triggered!`);
        },
        initialValues: {
            title: $content.content.title,
            shortDesc: $content.content.desc,
            longDesc: $content.content.body,
            category: categories.find(
                (item) => item.value === WorkKind[($content.content as Prose).meta.category],
            ),
            rating: ratings.find(
                (item) => item.value === ContentRating[($content.content as Prose).meta.rating],
            ),
            genres: mapGenres(($content.content as Prose).meta.genres),
            status: statuses.find(
                (item) => item.value === WorkStatus[($content.content as Prose).meta.status],
            ),
        },
    });

    const saveProse = createSubmitHandler({
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

            await saveChanges(
                $session.currProfile._id,
                $content.content._id,
                ContentKind.ProseContent,
                formInfo,
            ).then((res) => {
                updateContent(res);
                editMode = false;
            });
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
</script>

<svelte:head>
    {#if $content.content}
        <title>{$content.content.title} &mdash; Offprint</title>
        <!-- Primary Meta Tags -->
        <meta name="title" content={$content.content.title} />
        <meta name="description" content={$content.content.desc} />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta
            property="og:url"
            content="https://offprint.net/prose/{$content.content._id}/{slugify(
                $content.content.title,
            )}"
        />
        <meta property="og:title" content={$content.content.title} />
        <meta property="og:description" content={$content.content.desc} />
        <meta
            property="og:image"
            content={$content.content.meta.coverArt
                ? $content.content.meta.coverArt
                : $content.content.author.profile.avatar}
        />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta
            property="twitter:url"
            content="https://offprint.net/prose/{$content.content._id}/{slugify(
                $content.content.title,
            )}"
        />
        <meta property="twitter:title" content={$content.content.title} />
        <meta property="twitter:description" content={$content.content.desc} />
        <meta
            property="twitter:image"
            content={$content.content.meta.coverArt
                ? $content.content.meta.coverArt
                : $content.content.author.profile.avatar}
        />
    {/if}
</svelte:head>

<div class="w-full h-screen overflow-y-auto">
    <WorkBanner content={$content.content} ratings={$content.ratings} />
    <ApprovalOptions />
    <div class="w-11/12 mx-auto md:max-w-4xl my-6 flex flex-col md:flex-row">
        <WorkStats
            content={$content.content}
            libraryDoc={$content.libraryDoc}
            bind:editMode
            on:save={saveProse}
        />
        <div class="w-full">
            {#if editMode}
                <form use:form in:fade={{ delay: 0, duration: 150 }}>
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
                                bind:value={$data.category}
                                on:select={(e) => {
                                    $data.category = e.detail;
                                }}
                            />
                        </div>
                        <div class="hidden md:block md:mx-2"><!--separator--></div>
                        <div class="md:w-1/2 w-full">
                            <SelectMenu
                                items={genres}
                                label="Genre(s)"
                                isMulti={true}
                                bind:value={$data.genres}
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
                    <div class="my-4"><!--separator--></div>
                    <Editor label="Long Description" bind:value={$data.longDesc} />
                    <div class="flex items-center mt-4 flex-wrap md:flex-nowrap">
                        <div class="md:w-1/2 w-full">
                            <SelectMenu
                                items={ratings}
                                label="Rating"
                                bind:value={$data.rating}
                                on:select={(e) => {
                                    $data.rating = e.detail;
                                }}
                            />
                        </div>
                        <div class="hidden md:block md:mx-2"><!--separator--></div>
                        <div class="md:w-1/2 w-full">
                            <SelectMenu
                                items={statuses}
                                label="Status"
                                bind:value={$data.status}
                                on:select={(e) => {
                                    $data.status = e.detail;
                                }}
                            />
                        </div>
                    </div>
                </form>
            {:else}
                <div in:fade={{ delay: 0, duration: 150 }}>
                    <div class="mb-6">
                        <div
                            class="w-full border-b border-zinc-700 dark:border-white flex items-center pb-1"
                        >
                            <h3 class="text-2xl font-medium flex-1">Description</h3>
                            <Button on:click={() => (showDesc = !showDesc)}>
                                {#if showDesc}
                                    <ArrowUpSLine class="button-icon no-text" />
                                {:else}
                                    <ArrowDownSLine class="button-icon no-text" />
                                {/if}
                            </Button>
                        </div>
                        {#if showDesc}
                            <div
                                class="html-description"
                                transition:fly|local={{ delay: 0, duration: 150, y: -25 }}
                            >
                                {@html $content.content.body}
                            </div>
                        {/if}
                    </div>
                    <SectionList baseUrl="/prose/{$content.content._id}" />
                </div>
            {/if}
        </div>
    </div>
    {#if $content.content.audit.published === 'Published'}
        <div class="w-11/12 md:w-full max-w-3xl mx-auto mt-6">
            <Comments />
        </div>
    {/if}
</div>
