<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { setContent } from '$lib/repo/content.repo';
    import { getPage } from '$lib/repo/comments.repo';
    import { CommentKind } from '$lib/models/comments';
    import { fetchOne } from '$lib/services/content.service';

    export const load: Load = async ({ params, url }) => {
        const blogId: string = params.id;
        const content = await fetchOne(blogId);
        const page: number = url.searchParams.has('page') ? +url.searchParams.get('page') : 1;

        setContent(content.content);

        return {
            props: {
                content,
                comments: await getPage(content.content._id, CommentKind.ContentComment, page),
            },
        };
    };
</script>

<script lang="ts">
    import { createForm } from 'felte';
    import { content, updateContent } from '$lib/repo/content.repo';
    import { session } from '$lib/repo/session.repo';
    import { saveChanges, publishOne } from '$lib/services/content.service';
    import {
        slugify,
        pluralize,
        localeDate,
        MIN_TITLE_LENGTH,
        MAX_TITLE_LENGTH,
        MIN_LONG_DESC_LENGTH,
    } from '$lib/util';
    import {
        InformationLine,
        Edit2Line,
        DeleteBinLine,
        ShareBoxLine,
        DiscussLine,
        FlagLine,
        Save2Line,
        CloseLine,
        CheckboxBlankCircleLine,
        CheckboxCircleLine,
        EmotionLaughLine,
    } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';
    import Comments from '$lib/components/comments/Comments.svelte';
    import { ContentKind, PubStatus } from '$lib/models/content';
    import type { BlogForm } from '$lib/models/content/works/forms';

    let isEditing = false;

    const { form, data, errors, createSubmitHandler } = createForm({
        onSubmit: () => console.log(`Default handler hit!`),
        validate: (values) => {
            const errors = {
                title: '',
                body: '',
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

            return errors;
        },
        initialValues: {
            title: $content.content.title,
            body: $content.content.body,
        },
    });

    const saveBlog = createSubmitHandler({
        onSubmit: async (values) => {
            const formData: BlogForm = {
                title: values.title,
                body: values.body,
                rating: $content.content.meta.rating,
            };

            await saveChanges(
                $session.currProfile._id,
                $content.content._id,
                ContentKind.BlogContent,
                formData,
            ).then((res) => {
                updateContent(res);
                isEditing = false;
            });
        },
    });

    async function togglePublishStatus(pubStatus: PubStatus) {
        await publishOne($session.currProfile._id, $content.content._id, {
            oldStatus: $content.content.audit.published,
            newStatus: pubStatus,
        }).then((res) => {
            updateContent(res);
        });
    }
</script>

<svelte:head>
    <title>{$content.content.title} &mdash; Offprint</title>
    <!-- Primary Meta Tags -->
    <meta name="title" content={$content.content.title} />
    <meta name="description" content="From the blog of {$content.content.author.screenName}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://offprint.net/blog/{$content.content._id}" />
    <meta property="og:title" content={$content.content.title} />
    <meta
        property="og:description"
        content="From the blog of {$content.content.author.screenName}"
    />
    <meta property="og:image" content={$content.content.author.profile.avatar} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://offprint.net/blog/{$content.content._id}" />
    <meta property="twitter:title" content={$content.content.title} />
    <meta
        property="twitter:description"
        content="From the blog of {$content.content.author.screenName}"
    />
    <meta property="twitter:image" content={$content.content.author.profile.avatar} />
</svelte:head>

<div class="w-full overflow-y-auto">
    <div class="mx-auto max-w-4xl my-6">
        <div
            class="mx-auto w-11/12 md:w-full md:rounded-b-lg rounded-t-lg flex items-center z-20 relative md:shadow-2xl"
            style="background: var(--accent);"
        >
            <div
                class="m-4 rounded-full overflow-hidden w-20 h-20 md:w-28 md:h-28 border-4 border-white bg-white"
            >
                <img
                    src={$content.content.author.profile.avatar}
                    alt="{$content.content.author.screenName}'s avatar"
                    class="w-full h-full"
                />
            </div>
            <div>
                <h1 class="text-white font-medium text-3xl">{$content.content.title}</h1>
                <div class="flex items-center text-xs text-white">
                    <span
                        >by <a
                            class="text-white underline hover:no-underline"
                            href="/profile/{$content.content.author._id}"
                            >{$content.content.author.screenName}</a
                        ></span
                    >
                    <span class="mx-2">|</span>
                    <span
                        >{$content.content.stats.views} view{pluralize(
                            $content.content.stats.views,
                        )}</span
                    >
                    <span class="mx-2">|</span>
                    {#if $content.content.audit.publishedOn}
                        <span>{localeDate($content.content.audit.publishedOn, 'fullDate')}</span>
                    {:else}
                        <span>{localeDate($content.content.createdAt, 'fullDate')}</span>
                    {/if}
                </div>
            </div>
        </div>
        {#if $session.currProfile}
            <div
                class="w-11/12 md:w-full max-w-3xl mx-auto flex items-center rounded-b-lg z-10 p-2 relative"
                style="background: var(--accent);"
            >
                {#if $session.currProfile._id === $content.content.author._id}
                    {#if isEditing}
                        <Button kind="primary" on:click={saveBlog}>
                            <Save2Line class="button-icon" />
                            <span class="button-text">Save</span>
                        </Button>
                        <div class="mx-0.5" />
                        <Button kind="primary" on:click={() => (isEditing = !isEditing)}>
                            <CloseLine class="button-icon" />
                            <span class="button-text">Cancel</span>
                        </Button>
                    {:else}
                        <Button kind="primary" on:click={() => (isEditing = !isEditing)}>
                            <Edit2Line class="button-icon" />
                            <span class="button-text">Edit</span>
                        </Button>
                        <div class="mx-0.5" />
                        {#if $content.content.audit.published === 'Published'}
                            <Button
                                kind="primary"
                                on:click={() => togglePublishStatus(PubStatus.Unpublished)}
                            >
                                <CheckboxCircleLine class="button-icon" />
                                <span class="button-text">Published</span>
                            </Button>
                            <div class="mx-0.5" />
                            <Button kind="primary">
                                <ShareBoxLine class="button-icon" />
                                <span class="button-text">Share</span>
                            </Button>
                        {:else}
                            <Button
                                kind="primary"
                                on:click={() => togglePublishStatus(PubStatus.Published)}
                            >
                                <CheckboxBlankCircleLine class="button-icon" />
                                <span class="button-text">Unpublished</span>
                            </Button>
                        {/if}
                    {/if}
                    <div class="flex-1"><!--separator--></div>
                    <Button kind="primary" disabled={isEditing}>
                        <DeleteBinLine class="button-icon" />
                        <span class="button-text">Delete</span>
                    </Button>
                {:else}
                    <Button kind="primary">
                        <DiscussLine class="button-icon" />
                        <span class="button-text">Comment</span>
                    </Button>
                    <div class="mx-0.5" />
                    <Button kind="primary">
                        <ShareBoxLine class="button-icon" />
                        <span class="button-text">Share</span>
                    </Button>
                    <div class="flex-1"><!--separator--></div>
                    <Button kind="primary">
                        <FlagLine class="button-icon" />
                        <span class="button-text">Report</span>
                    </Button>
                {/if}
            </div>
        {/if}
        <div class="max-w-3xl mx-auto">
            {#if isEditing}
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
                </form>
            {:else}
                {#if $content.content.audit.published === 'Unpublished'}
                    <div
                        class="p-4 w-full rounded-lg border border-gray-700 dark:border-white flex items-center my-6"
                    >
                        <InformationLine size="24px" class="mr-2" />
                        <span>
                            <b>This blog is a draft.</b> No views will be counted when navigating to
                            this page, and comments and reactions are disabled.
                        </span>
                    </div>
                {/if}

                <div
                    class="blog-body w-11/12 md:w-full mx-auto"
                    class:mt-6={$content.content.audit.published === 'Published'}
                >
                    {@html $content.content.body}
                </div>
                <div
                    class="p-2 border-t border-b border-zinc-700 dark:border-white w-11/12 md:w-full mx-auto"
                >
                    <Button>
                        <EmotionLaughLine class="button-icon" />
                        <span class="button-text">Add Reaction</span>
                    </Button>
                </div>
            {/if}
        </div>
        {#if $content.content.audit.published === 'Published'}
            <div class="w-11/12 md:w-full max-w-3xl mx-auto mt-6">
                <Comments />
            </div>
        {/if}
    </div>
</div>
