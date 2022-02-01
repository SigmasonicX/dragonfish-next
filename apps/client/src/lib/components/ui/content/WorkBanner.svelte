<script lang="ts">
    import { slugify, abbreviate } from '$lib/util';
    import type { Content } from '$lib/models/content';
    import { TagKind } from '$lib/models/content/works';
    import TagBadge from '$lib/components/ui/content/TagBadge.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { HeartLine, DislikeLine } from 'svelte-remixicon';

    export let content: Content;
</script>

<div class="work-banner">
    <div class="flex flex-col items-center md:flex-row w-11/12 mx-auto md:max-w-4xl px-4 py-6">
        <div class="flex flex-col items-center md:justify-end md:items-baseline flex-1">
            <h1 class="text-4xl font-medium text-white">{content.title}</h1>
            <a
                href="/profile/{content.author._id}/{slugify(content.author.userTag)}"
                class="text-xl font-light text-white"
                style="font-family: var(--header-text);"
            >
                by {content.author.screenName}
            </a>
            <div class="flex items-center justify-center md:justify-start flex-wrap mb-4 md:mb-0">
                <TagBadge kind={TagKind.Type} type={content.kind} size={'large'} />
                <TagBadge kind={TagKind.Category} category={content.meta.category} size={'large'} />
                {#each content.meta.genres as genre}
                    <TagBadge kind={TagKind.Genre} {genre} size={'large'} />
                {/each}
            </div>
        </div>
        <div class="flex items-center">
            <Button kind="primary">
                <HeartLine class="button-icon" size="20px" />
                <span class="button-text relative top-[0.02rem]">
                    {abbreviate(content.stats.likes)}
                </span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button kind="primary">
                <DislikeLine class="button-icon" size="20px" />
                <span class="button-text relative top-[0.02rem]">
                    {abbreviate(content.stats.dislikes)}
                </span>
            </Button>
        </div>
    </div>
</div>

<style lang="scss">
    div.work-banner {
        @apply w-full text-white shadow-lg mb-6;
        background: var(--accent);
    }
</style>
