<script lang="ts">
    import { page } from '$app/stores';
    import { fetchAllNew } from '$lib/services/content.service';
    import { ContentKind } from '$lib/models/content';
    import { app } from '$lib/repo/app.repo';
    import { Loader5Line } from 'svelte-remixicon';
    import Paginator from '$lib/components/ui/misc/Paginator.svelte';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';

    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;
    function setNewPage(pageNum: number) {
        currPage = pageNum;
    }
</script>

{#await fetchAllNew(currPage, [ContentKind.PoetryContent, ContentKind.ProseContent], $app.filter)}
    <div class="w-full h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <Loader5Line class="animate-spin mr-2" size="2rem" />
            <span class="uppercase font-bold tracking-widest">Loading...</span>
        </div>
    </div>
{:then content}
    <div class="w-full overflow-y-auto">
        <div class="w-11/12 mx-auto my-6 max-w-7xl">
            <div
                class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
            >
                {#each content.data.docs as work}
                    <WorkCard content={work} />
                {/each}
            </div>
            <Paginator
                {currPage}
                perPage={content.data.limit}
                totalPages={content.data.totalPages}
                totalDocs={content.data.totalDocs}
                on:change={(e) => setNewPage(e.detail)}
            />
        </div>
    </div>
{:catch error}
    <div class="w-full h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <span class="uppercase font-bold tracking-widest">ERROR: Could not fetch content</span>
        </div>
    </div>
{/await}
