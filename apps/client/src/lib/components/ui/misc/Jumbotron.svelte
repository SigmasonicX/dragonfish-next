<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { fetchFeaturedPosts } from '$lib/services/content.service';
    import { CloseLine, InformationLine, Loader5Line } from 'svelte-remixicon';
    import { localeDate } from '$lib/util';

    enum Slides {
        First,
        Second,
        Third,
        Fourth,
    }
    let activeSlide: Slides = Slides.First;

    const featuredPosts = useQuery('featuredPosts', fetchFeaturedPosts);
</script>

{#if $featuredPosts.isLoading}
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="flex items-center">
            <Loader5Line class="animate-spin mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest">Loading...</span>
        </div>
    </div>
{:else if $featuredPosts.isError}
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="flex items-center">
            <CloseLine class="mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest"
                >Error retrieving featured posts
            </span>
        </div>
    </div>
{:else if $featuredPosts.data.length === 0}
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="flex items-center">
            <InformationLine class="mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest">Nothing currently featured</span>
        </div>
    </div>
{:else}
    <div class="jumbotron">
        <div class="big-box">
            {#if activeSlide === Slides.First}
                <img
                    src={$featuredPosts.data[0].meta.banner}
                    alt="banner"
                    transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
                />
                <div
                    class="box-info bg-zinc-300 dark:bg-zinc-700 bg-opacity-75 dark:bg-opacity-75 backdrop-blur"
                >
                    <h1>
                        <a href="/blog/{$featuredPosts.data[0]._id}">
                            {$featuredPosts.data[0].title}
                        </a>
                    </h1>
                    {#if $featuredPosts.data[0].desc}
                        <h2>{$featuredPosts.data[0].desc}</h2>
                    {/if}
                </div>
            {:else if activeSlide === Slides.Second}
                <img
                    src={$featuredPosts.data[1].meta.banner}
                    alt="banner"
                    transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
                />
                <div
                    class="box-info bg-zinc-300 dark:bg-zinc-700 bg-opacity-75 dark:bg-opacity-75 backdrop-blur"
                >
                    <h1>
                        <a href="/blog/{$featuredPosts.data[1]._id}">
                            {$featuredPosts.data[1].title}
                        </a>
                    </h1>
                    {#if $featuredPosts.data[1].desc}
                        <h2>{$featuredPosts.data[1].desc}</h2>
                    {/if}
                </div>
            {:else if activeSlide === Slides.Third}
                <img
                    src={$featuredPosts.data[2].meta.banner}
                    alt="banner"
                    transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
                />
                <div
                    class="box-info bg-zinc-300 dark:bg-zinc-700 bg-opacity-75 dark:bg-opacity-75 backdrop-blur"
                >
                    <h1>
                        <a href="/blog/{$featuredPosts.data[2]._id}">
                            {$featuredPosts.data[2].title}
                        </a>
                    </h1>
                    {#if $featuredPosts.data[2].desc}
                        <h2>{$featuredPosts.data[2].desc}</h2>
                    {/if}
                </div>
            {:else if activeSlide === Slides.Fourth}
                <img
                    src={$featuredPosts.data[3].meta.banner}
                    alt="banner"
                    transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
                />
                <div
                    class="box-info bg-zinc-300 dark:bg-zinc-700 bg-opacity-75 dark:bg-opacity-75 backdrop-blur"
                >
                    <h1>
                        <a href="/blog/{$featuredPosts.data[3]._id}">
                            {$featuredPosts.data[3].title}
                        </a>
                    </h1>
                    {#if $featuredPosts.data[3].desc}
                        <h2>{$featuredPosts.data[3].desc}</h2>
                    {/if}
                </div>
            {/if}
        </div>
        <div class="card-stack">
            <div
                class="card"
                class:active={activeSlide === Slides.First}
                on:click={() => (activeSlide = Slides.First)}
            >
                <div class="flex-1 truncate">
                    <h3>{$featuredPosts.data[0].title}</h3>
                    <div class="flex items-center">
                        <span class="hidden text-sm md:text-base md:block"
                            >by {$featuredPosts.data[0].author.screenName}</span
                        >
                        <span class="hidden md:block mx-1">•</span>
                        <span class="text-sm md:text-base"
                            >{localeDate(
                                $featuredPosts.data[0].audit.publishedOn,
                                'fullDate',
                            )}</span
                        >
                    </div>
                </div>
                <img src={$featuredPosts.data[0].author.profile.avatar} alt="demo avatar" />
            </div>
            <div
                class="card"
                class:active={activeSlide === Slides.Second}
                on:click={() => (activeSlide = Slides.Second)}
            >
                <div class="flex-1 truncate">
                    <h3>{$featuredPosts.data[1].title}</h3>
                    <div class="flex items-center">
                        <span class="hidden text-sm md:text-base md:block"
                            >by {$featuredPosts.data[1].author.screenName}</span
                        >
                        <span class="hidden md:block mx-1">•</span>
                        <span class="text-sm md:text-base"
                            >{localeDate(
                                $featuredPosts.data[1].audit.publishedOn,
                                'fullDate',
                            )}</span
                        >
                    </div>
                </div>
                <img src={$featuredPosts.data[1].author.profile.avatar} alt="demo avatar" />
            </div>
            <div
                class="card"
                class:active={activeSlide === Slides.Third}
                on:click={() => (activeSlide = Slides.Third)}
            >
                <div class="flex-1 truncate">
                    <h3>{$featuredPosts.data[2].title}</h3>
                    <div class="flex items-center">
                        <span class="hidden text-sm md:text-base md:block"
                            >by {$featuredPosts.data[2].author.screenName}</span
                        >
                        <span class="hidden md:block mx-1">•</span>
                        <span class="text-sm md:text-base"
                            >{localeDate(
                                $featuredPosts.data[2].audit.publishedOn,
                                'fullDate',
                            )}</span
                        >
                    </div>
                </div>
                <img src={$featuredPosts.data[2].author.profile.avatar} alt="demo avatar" />
            </div>
            <div
                class="card"
                class:active={activeSlide === Slides.Fourth}
                on:click={() => (activeSlide = Slides.Fourth)}
            >
                <div class="flex-1 truncate">
                    <h3>{$featuredPosts.data[3].title}</h3>
                    <div class="flex items-center">
                        <span class="hidden text-sm md:text-base md:block"
                            >by {$featuredPosts.data[3].author.screenName}</span
                        >
                        <span class="hidden md:block mx-1">•</span>
                        <span class="text-sm md:text-base"
                            >{localeDate(
                                $featuredPosts.data[3].audit.publishedOn,
                                'fullDate',
                            )}</span
                        >
                    </div>
                </div>
                <img src={$featuredPosts.data[3].author.profile.avatar} alt="demo avatar" />
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    div.jumbotron {
        @apply w-full h-full flex flex-col md:flex-row relative;
        div.big-box {
            @apply w-full md:w-2/3 relative overflow-hidden;
            img {
                @apply object-cover h-full w-full;
            }
            div.box-info {
                @apply absolute bottom-6 left-0 p-4 pl-6 rounded-r-lg hidden md:block;
                h1 {
                    @apply text-3xl md:text-5xl font-medium;
                    a {
                        color: var(--site-color);
                    }
                    color: var(--site-color);
                }
                h2 {
                    @apply text-xl md:text-3xl text-white;
                }
            }
        }
        div.card-stack {
            @apply w-full md:w-1/3 flex overflow-x-auto md:flex-col;
            div.card {
                @apply border-t-8 border-r md:border-r-0 md:border-t-0 md:border-l-8 md:border-b border-zinc-300 dark:border-zinc-600 min-w-[280px] max-w-[280px] md:max-w-full md:min-w-full md:w-full md:h-1/4 flex items-center p-4 cursor-pointer;
                &:last-child {
                    @apply border-b-0 border-r-0;
                }
                &.active {
                    @apply bg-zinc-200 dark:bg-zinc-700;
                    border-color: var(--accent);
                }
                h3 {
                    @apply text-lg md:text-2xl font-medium w-full truncate;
                }
                img {
                    @apply w-16 h-16 rounded-full border-2 hidden md:block;
                    border-color: var(--borders);
                }
            }
        }
    }
</style>
