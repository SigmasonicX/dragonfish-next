<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { createForm } from 'felte';
    import { session } from '$lib/repo/session.repo';
    import {
        abbreviate,
        pluralize,
        localeDate,
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
    import {
        AddBoxLine,
        FlagLine,
        ShareBoxLine,
        ArrowDownSLine,
        ArrowUpSLine,
        Edit2Line,
        DeleteBinLine,
        CheckboxCircleLine,
        CheckboxBlankCircleLine,
        CloseCircleLine,
        TimeLine,
        Save2Line,
        CloseLine,
    } from 'svelte-remixicon';
    import SectionList from '$lib/components/ui/content/SectionList.svelte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';
    import { Genres, Prose, WorkKind, WorkStatus } from '$lib/models/content/works';
    import { ContentKind, ContentRating } from '$lib/models/content';
    import type { CreateProse } from '$lib/models/content/works/forms';
    import { saveChanges } from '$lib/services/content.service';

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
        onSubmit: (values) => {
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

<div class="w-full h-screen overflow-y-auto">
    <WorkBanner content={$content.content} />
    <div class="w-11/12 mx-auto md:max-w-4xl my-6 flex flex-col md:flex-row">
        <div
            class="flex flex-col w-full md:mr-6 md:max-w-[128px] md:max-h-[35.875rem] md:mb-0 rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed mb-6"
        >
            <div class="flex items-center md:flex-col p-2 border-b-2 border-zinc-500">
                {#if $session.currProfile && $session.currProfile._id === $content.content.author._id}
                    {#if editMode}
                        <Button classes="md:w-full md:justify-center" on:click={saveProse}>
                            <Save2Line class="button-icon" />
                            <span class="button-text">Save</span>
                        </Button>
                        <div class="mx-0.5 md:mx-0 md:my-0.5"><!--separator--></div>
                        <Button
                            classes="md:w-full md:justify-center"
                            on:click={() => (editMode = !editMode)}
                        >
                            <CloseLine class="button-icon" />
                            <span class="button-text">Cancel</span>
                        </Button>
                    {:else}
                        <Button
                            classes="md:w-full md:justify-center"
                            on:click={() => (editMode = !editMode)}
                        >
                            <Edit2Line class="button-icon" />
                            <span class="button-text">Edit</span>
                        </Button>
                        <div class="mx-0.5 md:mx-0 md:my-0.5"><!--separator--></div>
                        {#if $content.content.audit.published === 'Published'}
                            <Button classes="md:w-full md:justify-center" disabled={editMode}>
                                <CheckboxCircleLine class="button-icon" />
                                <span class="button-text">Published</span>
                            </Button>
                        {:else if $content.content.audit.published === 'Unpublished'}
                            <Button classes="md:w-full md:justify-center" disabled={editMode}>
                                <CheckboxBlankCircleLine class="button-icon" />
                                <span class="button-text">Draft</span>
                            </Button>
                        {:else if $content.content.audit.published === 'Pending'}
                            <Button classes="md:w-full md:justify-center" disabled={editMode}>
                                <TimeLine class="button-icon" />
                                <span class="button-text">Pending</span>
                            </Button>
                        {:else if $content.content.audit.published === 'Rejected'}
                            <Button classes="md:w-full md:justify-center" disabled={editMode}>
                                <CloseCircleLine class="button-icon" />
                                <span class="button-text">Rejected</span>
                            </Button>
                        {/if}
                    {/if}
                    <div class="flex-1 md:flex-auto md:my-0.5"><!--separator--></div>
                    <Button
                        classes="md:w-full md:justify-center"
                        disabled={editMode}
                        on:click={() => console.log(`Delete button hit!`)}
                    >
                        <DeleteBinLine class="button-icon" />
                        <span class="button-text">Delete</span>
                    </Button>
                {:else}
                    <Button classes="md:w-full md:justify-center">
                        <AddBoxLine class="button-icon" />
                        <span class="button-text">Library</span>
                    </Button>
                    <div class="mx-0.5 md:mx-0 md:my-0.5"><!--separator--></div>
                    <Button classes="md:w-full md:justify-center">
                        <ShareBoxLine class="button-icon" />
                        <span class="button-text">Share</span>
                    </Button>
                    <div class="flex-1 md:flex-auto md:my-0.5"><!--separator--></div>
                    <Button classes="md:w-full md:justify-center">
                        <FlagLine class="button-icon" />
                        <span class="button-text">Report</span>
                    </Button>
                {/if}
            </div>
            <div class="flex items-center justify-center md:flex-col">
                <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
                    {#if $content.content.audit.publishedOn}
                        <span class="text text-zinc-500 dark:text-zinc-400">Published</span>
                        <span class="stat">
                            {localeDate($content.content.audit.publishedOn, 'mediumDate')}
                        </span>
                    {:else}
                        <span class="text text-zinc-500 dark:text-zinc-400">Created</span>
                        <span class="stat">
                            {localeDate($content.content.createdAt, 'mediumDate')}
                        </span>
                    {/if}
                </div>
                <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        View{pluralize($content.content.stats.views)}
                    </span>
                    <span class="stat">{abbreviate($content.content.stats.views)}</span>
                </div>
                <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        Word{pluralize($content.content.stats.words)}
                    </span>
                    <span class="stat">{abbreviate($content.content.stats.words)}</span>
                </div>
                <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        Comment{pluralize($content.content.stats.comments)}
                    </span>
                    <span class="stat">{abbreviate($content.content.stats.comments)}</span>
                </div>
                <div class="stat-box">
                    <span class="text text-zinc-500 dark:text-zinc-400">Status</span>
                    <span class="stat">{$content.content.meta.status}</span>
                </div>
            </div>
        </div>
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
                        <div class="hidden md:block md:mx-2" />
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
                    <div class="my-4" />
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
                        <div class="hidden md:block md:mx-2" />
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
                    <SectionList />
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    div.stat-box {
        @apply flex flex-col items-center justify-center w-[8rem] h-[4.5rem] md:h-[5.5rem];
        span.text {
            @apply font-semibold uppercase mb-2 text-[0.7rem] md:text-xs tracking-widest;
        }
        span.stat {
            @apply md:text-base text-sm font-serif;
        }
    }
</style>
