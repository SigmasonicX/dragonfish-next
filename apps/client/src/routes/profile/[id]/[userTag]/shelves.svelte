<script lang="ts">
    import { profile$ } from '$lib/repo/profile.repo';
    import { slugify } from '$lib/util';
</script>

<svelte:head>
    <title>{$profile$.screenName}'s Shelves &mdash; Offprint</title>
    <!-- Primary Meta Tags -->
    <meta name="title" content="{$profile$.screenName}'s Shelves on Offprint" />
    <meta name="description" content="Taking a look at {$profile$.screenName}'s shelves" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta
        property="og:url"
        content="https://offprint.net/profile/{$profile$._id}/{slugify($profile$.userTag)}"
    />
    <meta property="og:title" content="{$profile$.screenName}'s Shelves on Offprint" />
    <meta property="og:description" content="Taking a look at {$profile$.screenName}'s shelves" />
    <meta property="og:image" content={$profile$.profile.avatar} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta
        property="twitter:url"
        content="https://offprint.net/profile/{$profile$._id}/{slugify($profile$.userTag)}"
    />
    <meta property="twitter:title" content="{$profile$.screenName}'s Shelves on Offprint" />
    <meta
        property="twitter:description"
        content="Taking a look at {$profile$.screenName}'s shelves"
    />
    <meta property="twitter:image" content={$profile$.profile.avatar} />
</svelte:head>

<div class="empty">
    <h3>Pardon our dust—</h3>
    <p>This feature is not yet available.</p>
</div>
