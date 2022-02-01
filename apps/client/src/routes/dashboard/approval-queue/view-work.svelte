<script lang="ts">
    import { slugify, pluralize, abbreviate, localeDate } from '$lib/util';
    import { approvalQueue } from '$lib/repo/approval-queue.repo';
    import { Poetry, Prose, TagKind } from '$lib/models/content/works';
    import TagBadge from '$lib/components/ui/content/TagBadge.svelte';

    $: author = $approvalQueue.currItem.workToApprove.author;
    $: work = $approvalQueue.currItem.workToApprove as Prose | Poetry;
</script>

<div class="w-11/12 mx-auto md:max-w-4xl flex flex-col my-6">
    <div
        class="flex items-center rounded-lg p-4 bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed"
    >
        <div class="flex-1">
            <h1 class="text-3xl font-medium">{work.title}</h1>
            <span>
                by <a href="/profile/{author._id}/{slugify(author.userTag)}">{author.screenName}</a>
            </span>
            <div
                class="flex items-center justify-center md:justify-start flex-wrap mb-4 mt-4 md:mb-0"
            >
                <TagBadge kind={TagKind.Type} type={work.kind} size={'large'} />
                <TagBadge kind={TagKind.Category} category={work.meta.category} size={'large'} />
                {#each work.meta.genres as genre}
                    <TagBadge kind={TagKind.Genre} {genre} size={'large'} />
                {/each}
            </div>
            <div class="mt-4">
                <h5 class="font-medium text-lg" style="color: var(--text-color);">
                    Short Description
                </h5>
                <div class="rounded-lg p-4 bg-zinc-400 dark:bg-zinc-800">
                    {@html $approvalQueue.currItem.workToApprove.desc}
                </div>
            </div>
            <div class="mt-4">
                <h5 class="font-medium text-lg" style="color: var(--text-color);">
                    Long Description
                </h5>
                <div class="rounded-lg p-4 bg-zinc-400 dark:bg-zinc-800 html-description">
                    {@html $approvalQueue.currItem.workToApprove.body}
                </div>
            </div>
            <div class="mt-4 flex items-center justify-center">
                <div class="stat-box border-r-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">Created</span>
                    <span class="stat">
                        {localeDate(work.createdAt, 'mediumDate')}
                    </span>
                </div>
                <div class="stat-box border-r-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        View{pluralize(work.stats.views)}
                    </span>
                    <span class="stat">{abbreviate(work.stats.views)}</span>
                </div>
                <div class="stat-box border-r-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        Word{pluralize(work.stats.words)}
                    </span>
                    <span class="stat">{abbreviate(work.stats.words)}</span>
                </div>
                <div class="stat-box">
                    <span class="text text-zinc-500 dark:text-zinc-400">Status</span>
                    <span class="stat">{work.meta.status}</span>
                </div>
            </div>
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
