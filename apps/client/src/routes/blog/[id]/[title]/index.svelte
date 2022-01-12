<script lang="ts">
    import { content } from '$lib/repo/content.repo';
    import { slugify, pluralize, localeDate } from '$lib/util';
</script>

<svelte:head>
    <title>{$content.content.title} &mdash; Offprint</title>
    <!-- Primary Meta Tags -->
    <meta name="title" content={$content.content.title} />
    <meta name="description" content="From the blog of {$content.content.author.screenName}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta
        property="og:url"
        content="https://offprint.net/blog/{$content.content._id}/{slugify($content.content.title)}"
    />
    <meta property="og:title" content={$content.content.title} />
    <meta
        property="og:description"
        content="From the blog of {$content.content.author.screenName}"
    />
    <meta property="og:image" content={$content.content.author.profile.avatar} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta
        property="twitter:url"
        content="https://offprint.net/blog/{$content.content._id}/{slugify($content.content.title)}"
    />
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
            class="w-full rounded-lg shadow-xl flex items-center"
            style="background: var(--accent);"
        >
            <div class="m-4 rounded-full overflow-hidden w-28 h-28 border-4 border-white bg-white">
                <img
                    src={$content.content.author.profile.avatar}
                    alt="{$content.content.author.screenName}'s avatar"
                    class="w-full h-full"
                />
            </div>
            <div>
                <h1 class="text-white font-medium text-3xl">{$content.content.title}</h1>
                <div class="flex items-center text-xs">
                    <span
                        >by <a
                            class="text-white underline hover:no-underline"
                            href="/profile/{$content.content.author._id}/{slugify(
                                $content.content.author.userTag,
                            )}">{$content.content.author.screenName}</a
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
    </div>
</div>
