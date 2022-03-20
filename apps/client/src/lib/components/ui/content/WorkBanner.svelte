<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import { setVote } from '$lib/repo/content.repo';
    import { abbreviate } from '$lib/util';
    import type { Content } from '$lib/models/content';
    import { TagKind } from '$lib/models/content/works';
    import TagBadge from '$lib/components/ui/content/TagBadge.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { HeartLine, DislikeLine, HeartFill, DislikeFill } from 'svelte-remixicon';
    import type { Ratings } from '$lib/models/content/ratings';
    import { RatingOption } from '$lib/models/content/ratings';

    export let content: Content;
    export let ratings: Ratings;

    async function setLike() {
        await setVote(content._id, RatingOption.Liked);
    }

    async function setDislike() {
        await setVote(content._id, RatingOption.Disliked);
    }

    async function setNoVote() {
        await setVote(content._id, RatingOption.NoVote);
    }
</script>

<div class="work-banner">
    <div class="flex flex-col items-center md:flex-row w-11/12 mx-auto md:max-w-4xl px-4 py-6">
        <div class="flex flex-col items-center md:justify-end md:items-baseline flex-1">
            <div class="flex flex-wrap items-center">
                <h1 class="text-4xl font-medium text-white text-center md:text-left">
                    {content.title}
                </h1>
                <TagBadge kind={TagKind.Rating} rating={content.meta.rating} hasIcon={false} />
            </div>
            <a
                href="/profile/{content.author._id}"
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
            <div class="flex items-center justify-center md:justify-start flex-wrap mb-4 md:mb-0">
                {#each content.tags as tag}
                    <TagBadge kind={TagKind.Fandom} {tag} size={'large'} />
                {/each}
            </div>
        </div>
        <div class="flex items-center">
            {#if $session.account}
                {#if ratings.rating === RatingOption.Liked}
                    <Button kind="primary" isActive on:click={setNoVote} title="Like">
                        <HeartFill class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate(content.stats.likes)}
                        </span>
                    </Button>
                    <div class="mx-0.5"><!--separator--></div>
                    <Button kind="primary" on:click={setDislike} title="Dislike">
                        <DislikeLine class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate(content.stats.dislikes)}
                        </span>
                    </Button>
                {:else if ratings.rating === RatingOption.Disliked}
                    <Button kind="primary" on:click={setLike} title="Like">
                        <HeartLine class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate(content.stats.likes)}
                        </span>
                    </Button>
                    <div class="mx-0.5"><!--separator--></div>
                    <Button kind="primary" isActive on:click={setNoVote} title="Dislike">
                        <DislikeFill class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate(content.stats.dislikes)}
                        </span>
                    </Button>
                {:else}
                    <Button kind="primary" on:click={setLike} title="Like">
                        <HeartLine class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate(content.stats.likes)}
                        </span>
                    </Button>
                    <div class="mx-0.5"><!--separator--></div>
                    <Button kind="primary" on:click={setDislike} title="Dislike">
                        <DislikeLine class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate(content.stats.dislikes)}
                        </span>
                    </Button>
                {/if}
            {:else}
                <Button kind="primary" disabled title="Like">
                    <HeartLine class="button-icon" size="20px" />
                    <span class="button-text relative top-[0.02rem]">
                        {abbreviate(content.stats.likes)}
                    </span>
                </Button>
                <div class="mx-0.5"><!--separator--></div>
                <Button kind="primary" disabled title="Dislike">
                    <DislikeLine class="button-icon" size="20px" />
                    <span class="button-text relative top-[0.02rem]">
                        {abbreviate(content.stats.dislikes)}
                    </span>
                </Button>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    div.work-banner {
        @apply w-full text-white shadow-lg mb-6;
        background: var(--accent);
    }
</style>
