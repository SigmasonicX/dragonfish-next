<script lang="ts">
    import { isLoggedIn$, currentProfile$ } from '$lib/repo/session.repo';
    import { filter } from '$lib/repo/app.repo';
    import { Loader5Line } from 'svelte-remixicon';
    import { content } from '$lib/services';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
</script>

<div class="w-full overflow-y-auto">
    <div class="w-11/12 mx-auto my-6">
        {#if $isLoggedIn$ && $currentProfile$ !== null}
            <div class="section">
                <div class="section-header border-zinc-600 dark:border-white">
                    <h3>Recommendations</h3>
                    <a href="/explore/recommendations">See more >></a>
                </div>
                <div class="section-loading">
                    <div class="inner-loader">
                        <span>Select a profile to view recommendations</span>
                    </div>
                </div>
            </div>
        {/if}
        <div class="section">
            <div class="section-header border-zinc-600 dark:border-white">
                <h3>Popular this week</h3>
                <a href="/explore/popular-this-week">See more >></a>
            </div>
            <div class="section-loading">
                <div class="inner-loader">
                    <Loader5Line class="animate-spin mr-2" size="32px" />
                    <span>Loading...</span>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="section-header border-zinc-600 dark:border-white">
                <h3>Popular today</h3>
                <a href="/explore/popular-today">See more >></a>
            </div>
            <div class="section-loading">
                <div class="inner-loader">
                    <Loader5Line class="animate-spin mr-2" size="32px" />
                    <span>Loading...</span>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="section-header border-zinc-600 dark:border-white">
                <h3>New works</h3>
                <a href="/explore/new-works">See more >></a>
            </div>
            {#await content.fetchFirstNew(filter())}
                <div class="section-loading">
                    <div class="inner-loader">
                        <Loader5Line class="animate-spin mr-2" size="32px" />
                        <span>Loading...</span>
                    </div>
                </div>
            {:then content}
                <div
                    class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4"
                >
                    {#each content.data as work}
                        <WorkCard content={work} />
                    {/each}
                </div>
            {:catch error}
                <div class="section-loading">
                    <div class="inner-loader">
                        <span>ERROR: Could not fetch content</span>
                    </div>
                </div>
            {/await}
        </div>
        <div class="section">
            <div class="section-header border-zinc-600 dark:border-white">
                <h3>Special events</h3>
                <a href="/explore/special-events">See more >></a>
            </div>
            <div class="section-loading">
                <div class="inner-loader">
                    <span>No Events Currently Running</span>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    div.section {
        @apply mb-6;
        div.section-header {
            @apply flex items-center p-2 mb-4 border-b;
            h3 {
                @apply text-3xl font-medium flex-1;
            }

            a {
                @apply text-sm;
            }
        }

        div.section-loading {
            @apply w-full h-96 flex flex-col items-center justify-center;
            div.inner-loader {
                @apply flex items-center;
                span {
                    @apply uppercase font-bold tracking-widest;
                }
            }
        }
    }
</style>
