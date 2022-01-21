<script lang="ts">
    import { slugify } from '$lib/util';
    import type { Content } from '$lib/models/content';
    import { TagKind } from '$lib/models/content/works';
    import TagBadge from '$lib/components/ui/content/TagBadge.svelte';

    export let content: Content;
</script>

<div class="work-banner">
    <div class="flex w-11/12 mx-auto md:max-w-4xl px-4 py-6">
        <div class="flex flex-col justify-end">
            <h1 class="text-4xl font-medium text-white">{content.title}</h1>
            <a
                href="/profile/{content.author._id}/{slugify(content.author.userTag)}"
                class="text-xl font-light text-white"
                style="font-family: var(--header-text);"
            >
                by {content.author.screenName}
            </a>
            <div class="flex items-center flex-wrap mb-2">
                <TagBadge kind={TagKind.Type} type={content.kind} size={'large'} />
                <TagBadge kind={TagKind.Category} category={content.meta.category} size={'large'} />
                {#each content.meta.genres as genre}
                    <TagBadge kind={TagKind.Genre} {genre} size={'large'} />
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    div.work-banner {
        @apply w-full text-white shadow-lg;
        background: var(--accent);
    }
</style>
